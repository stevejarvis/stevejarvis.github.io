---
layout: single
title: When Read-Only isn't Immutable
author: steve_jarvis
excerpt: Abusing a config that may look safe to escape a container.
tags: [k8s, kubernetes, containers, read-only, socket, security, project]
comments: true
header:
  overlay_color: "#000"
  overlay_filter: "0.2"
  overlay_image: /assets/images/lookout_mtn_clipd.jpeg
  caption: "Biking Lookout Mountain in Golden, CO"
toc: false
---

We were reviewing a Kubernetes manifest for a 3rd party integration. It was a service from a well-known vendor and included read-only access to `/var/`.  Read-only typically means exactly what it says on the tin: no writing, no deleting, no mutable actions allowed. It _feels_ like that should apply to everything in the mount. And on first pass, most of the reviewers were in the "sounds good to me" camp for exactly that reason. Once it made the rounds and raised concerns, the vendor themselves defended the mount with "well it's read-only". 

If you know where this is going (that read-only permissions don't apply to sockets and there's some serious goodies in `/var/`) then there's nothing too surprising coming up. If not, buckle up because we're going to use a seemingly innocent manifest to escape from a Kubernetes container and write some files on the host! :rocket:

_And obligatory but important: Use information here only in systems you have permission to operate on._

# The Breakout

## What Are We Actually Lookin' At
Take this example manifest:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-world-service
spec:
  containers:
  - name: hello-world
    image: hello-world:latest
    imagePullPolicy: Always
    command: ["sleep", "infinity"]
    securityContext:
      capabilities:
        drop:
        - ALL
    volumeMounts:
    - name: var
      mountPath: /var
      readOnly: true
  volumes:
  - name: var
    hostPath:
      path: /var
      type: Directory
```

Having a host mount at all should raise eyebrows, but assuming there's some justification for it I'd dare say that manifest passes the sniff test. The container drops *all* Linux capabilities, `/var/` is Linux's store for variable data, logs, and temporary file kind of stuff, and we're clearly only granting read access to it. So sure, maybe we have some kind of SIEM service that's aggregating logs, this looks like a very fair config. 

## How Juicy Is `/var` Really, though?
Here's the jam. `/var/runtime/` includes the runtime socket for `containerd` (and `docker` and probably others, but here we're using `containerd`). That's the socket that start, stops, kills containers, and pulls images. It's the socket that offers the container runtime API to the Kubernetes controller. It's everything. And the only authorization here is provided by Linux's file permissions, the API itself has none. And, for reasons I'll get into a little more later, the `readOnly: true` config means nothing for a socket. So the seemingly innocent manifest above actually grants carte blanche access to the container runtime, which itself usually runs with significant permission, and we're going to leverage that to increase our own privilege.

## Taking Advantage of This
I'm not for a moment implying a trusted vendor would do anything like this to escalate permissions, that's bananas. I _am_ implying that supply chain compromise is a real, regular reality, and any exploit in a 3rd party can immediately become your own. So imagine we're a 4th party attacker who's silently compromised a trusted 3rd party. We're running code in a Kuberenetes pod like above, including read access to all of host `/var/`. How do we exploit the situation to escalate privilege and take full control of the host? 

We're going to abuse our powers and launch a more privileged image and pivot from there. To recap, here's our situation:

1. We (the 4th party attacker) have the ability to run untrusted code in a trusted pod
2. The trusted pod is running with the above k8s manifest :point_up:
3. The goal is to escape the container and get access to the node

### Step 1. What's Easy: Killing Processes
Enter tools like `ctr` and `crictl`. They're CLIs that you can point to that `/var/runtime/containerd.sock` and interact directly with `containerd` API. And if you run those in the compromised container, you'll quickly discover that you can do something like this:

```bash
$ ctr --address /run/containerd/containerd.sock containers list
$ ctr --address /run/containerd/containerd.sock containers delete <choose a container id>
```

and delete one of the other containers running in the cluster, no questions asked. Solid start, but we're looking to get to the host here, not just wreck havoc.

### Step 2. What Isn't Easy: Launching an Arbitrary Image
What we'd really love to do is run our own image, from our own registry. When you do the above, especially paired with the `ctr` man page for `container create`, you'd _think_ running any abitrary image is one short step away. But no, it's actually a major hurdle. Remember a container image is basically a filesystem that contains what an application needs to run. When launching a new image a few key things happen:

1. The runtime pulls the image 
2. The runtime prepares the filesystem, defining the container
3. The runtime starts a task in that container

#### WTF is a Snapshotter and Why's it In Our Way
Step 2 is actually quite hard. Remember we're giving instructions to the `containerd` runtime, but that runtime itself is a process on the host. So when it gets to referencing a prepared filesystem for the container, if it's told the filesystem is prepared at `/tmp/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/<snapshot-id>/fs`, it's going to look in the host's `/tmp/`, not the current container's. And we don't have permission to add or modify mounts. 

sequenceDiagram
    participant InfectedContainer as Infected Container
    participant Containerd as containerd.sock (host)
    participant HostFS as Host Filesystem

    InfectedContainer->>Containerd: API call: CreateContainer (with new image)
    Containerd->>HostFS: Prepare snapshot (overlayfs mount)
    HostFS-->>Containerd: Permission Denied (mount fails)
    Containerd-->>InfectedContainer: Error: permission denied (mount failure)

Even though we can talk to `containerd`, when we ask it to create a new container, it tries to prepare a new overlayfs snapshot on the host. Since the host filesystem is read-only, this step fails with a "permission denied" error. That's why simply requesting containerd to launch a new image from inside a container doesn't work as easily as it seems like it might.

#### Solution: Reuse Prepared Snapshots
What do we _really_ want though? The  goal isn't really to run our own image, it's to run our own code (to then wiggle out to the host). So... let's just aim for a shell. Well lucky us, we're already running in a k8s context that's launched oodles of images, and they've been prepared in the host directory we have read access to. So let's simply look through the already prepared filesystems for a shell.

```go
	snapshotsDir := "/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots"
	entries, err := ioutil.ReadDir(snapshotsDir)
	if err != nil {
		log.Fatalf("Failed to read snapshots directory: %v", err)
	}

	var rootfsPath string
	for _, entry := range entries {
		if entry.IsDir() {
			fsPath := filepath.Join(snapshotsDir, entry.Name(), "fs")
			if _, err := os.Stat(fsPath); err == nil {
				shPath := filepath.Join(fsPath, "bin", "sh")
				if _, err := os.Stat(shPath); err == nil {
					rootfsPath = fsPath
					break
				}
      }
		}
	}
```

Seems silly, but baby is that effective. If there's any shell in any image already present, it'll just identity which one. Then there's an image we know can be reused to run arbitrary shell code.

### Step 3. Escalate Privilege and chroot
I'm purposelly skipping some interesting steps here, because this blog is a word of caution, not an exploit manual. But the steps are honestly not any more than mildly interesting, you should assume any attacker who can read a man page has a fresh container running at this point, and it has the host `/` mounted and `cat /proc/$$/status | grep Cap` shows it's granted the default capabilities (including those that were explicitly dropped in the original manifest!) 

From this new container, it's a short:

```sh
chroot /host /bin/sh # note this can't be done on the original container
useradd steve
echo "steve:p@ss" | chpasswd
```

to establish a persistent user on the node. We've escalated, escaped, and how have a user we can use on the host. If you're more a visual :tada: person, then `touch /tmp/hi_i_was_here` is also stellar proof. 

So mission accomplished, we escaped and are tromping around the node.

# Should This Be Obvious?
I want to spend another minute on _why_ it's reasonable that this would be an accepted config to start with. If you don't buy into the idea that this is not common knowledge in the security community, note that sources on the internet are all over the place. Some recognize the risk, others don't and imply read-only is safe. 

From [Bottlerocket's security guidance](https://github.com/bottlerocket-os/bottlerocket/blob/develop/SECURITY_GUIDANCE.md#restrict-access-to-the-container-runtime-socket).

<figure class="full">
    <a href="/assets/images/read-only-isnt-immutable/bottlerocket-sec-guidance.png"><img src="/assets/images/read-only-isnt-immutable/bottlerocket-sec-guidance.png"></a>
    <figcaption>It's not technically wrong, but a reader could easily infer "oh, just don't give it write access and it'll be ok".</figcaption>
</figure>

This is just one of the most reputable examples I know of, there's many more in random blogs and StackOverflow answers. There's enough verbiage online implying that `readOnly: true` makes for a safe configuration that Google's Gemini has learned to confidently asset that's the case.

<figure class="full">
    <a href="/assets/images/read-only-isnt-immutable/gemini.png"><img src="/assets/images/read-only-isnt-immutable/gemini.png"></a>
    <figcaption>Gemini is sure that filesystem permissions apply to sockets.</figcaption>
</figure>

And even as I'm writing this post, using VS Code with Copilot enabled, I asked Copilot to read what I've written and suggest remediations not already mentioned. Despite all this context focused precisely on read-only not being a mitigation, it still suggested "make it read-only and drop caps". :weary:

<figure class="full">
    <a href="/assets/images/read-only-isnt-immutable/copilot.png"><img src="/assets/images/read-only-isnt-immutable/copilot.png"></a>
    <figcaption>Even when you have an entire blog post of context about why neither of these things matter in this case, AI thinks maybe they really do matter. This is Copilot using the GPT 4.1 model.</figcaption>
</figure>

## Why Is It Like This?
Why's it like this, anyway? It's because sockets are interprocess communication (IPC), files are part of the filesystem, and in Linux these are totally separate things. The Kubernetes read-only config employs the virtual filesystem in Linux to make sure there are no modifications made to any filesystem resources. That enforcement includes POSIX calls like `open`. Connecting to a socket is just not part of that stack, the POSIX call is `connect`, and it's entirely outside of the filesystem's purview. Unless you've been here and are already familiar for one reason or another, I don't think the distinction is really at all obvious. 

What you get with a read-only `/var/` mount is no ability to change the name of the socket file, or delete it or create a new one. But nothing stopping you from connecting to what exists and sending/receiving traffic over that connection.

# How to Guard Against This

## Don't Mount Sockets At All 
This one is obvious I guess. Don't mount a socket to start with.

## Don't Have Any Shells, Anywhere
Is "no shells anywhere in the cluster" really plausible? Maybe. I dunno. If you try hard enough, probably. Note any interpreter (`python`, `node`) would still have allowed arbitrary code execution in a escalated container. It _might_ have stopped the `chroot` total takeover, but there's better hackers than me out there, so while it's for sure a helpful mitigation, I wouldn't count on it to stop an advanced threat.

## Go Harder on Least Privilege
"Least privilege" doesn't mean just not granting the host mount, it could have also been restrictions with tools like SELinux. Those extra security guards could have prevented the socket connection, or the filesystem preparation, or chroot to the host and the mutable actions we took in the last mile. 

Or, if it is a SIEM tool, maybe it could have simply specified `/var/log` and not just `/var`. In this case that would have made all the difference.

It could have also been prevented by using non-root users in the original container, since those are the permissions enforced by Linux when evaluating `connect` to the runtime socket. Or using user namespacing, so the UID 0 in the container wasn't allowed to actually connect to the socket owned by UID 0 on the host.

# Conclusion
This is an educational post. Let's work together to find better ways of accomplishing security goals. If a defensive measure requires permissions that could just as easily be leveraged to take over the host, we should find a better way to achieve the goal!
