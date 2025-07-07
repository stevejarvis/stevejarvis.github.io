---
layout: single
title: Hitchdpix 
author: steve_jarvis
excerpt: Crowd-sourced event photography. Imagine all your low-tech family being able to share their full resolution shots from your wedding or big event, no account creation or apps for them to learn.
tags: [side project, computer science, photography, qr code, hitchdpix, jwt, pics, wedding, project]
comments: true
header:
  overlay_image: /assets/images/hitchdpix-intro/icon.png
  teaser: /assets/images/hitchdpix-intro/icon.png
  overlay_filter: 0.4
  caption: Logo I made for Hitchdpix. Meant to look like a camera melded with an engagement ring.
toc: true
---

<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

_Update: I wasn't getting around to fixing bugs and adding features and it started to weigh on me a bit. 
So instead of leaving it out there in its current state, for now the app is down and all Hitchdpix links 
301 to this post._ 

# The Vision
A few years ago we got married! Friends and family came from all over and sent us oodles of 
candid shots over the following weeks. Pics came via text/SMS, email, Facebook albums, shared 
iCloud folders... whatever worked. And obviously it _did_ work, we got the pictures, but photos over
most of those mediums are compressed, and collecting everything for safe keeping was kinda a 
lot of work. Maybe we could have set up our own _\<Insert Favorite Provider's\>_ Drive to share 
and ask people to drop pics there, but needing guests to create an account for something like that
is a big ask, and in many cases they're very not tech savvy; it's just not gonna happen.

So! What if there was a service that didn't require any download, no login, and no set of instructions 
longer than a partying aunt would mind following? That's exactly the goal for [Hitchdpix](https://www.hitchdpix.com). 
And in the end, the happy couple ends up with all those precious shots in one place.

To recap:
* No app download.
* No login or signup (for guests).
* Minimal tech knowledge required.
* Easy download of all submitted full resolution photos (for the married couple).

![dashboard](/assets/images/hitchdpix-intro/new_event.png)
_Hitchdpix = Getting hitched + pictures, get it?_

# Design
## Language, Frameworks, and Hosting
This is a Node.js & Express app hosted with Google App Engine (GAE) in GCP. The UI is rendered server-side
with Pug templating. For the most part, I chose all these tools just because I wanted to learn them. I'd not 
written much Javascript before, and while I have some experience with AWS, I didn't have any with GCP. GCP's free
tier was also marginally more attractive than AWS's, and I don't have "a budget" for this side project, so 
cost is a close second in the hosting consideration.

DNS is the only bit not managed by GCP, and that's configured manually. The rest is defined in a GAE app file
and deployed using the `gcloud` CLI :shipit:.

## Authn & Authz
The event owner does a very typical OAuth sign in to create and manage events. That's not so
interesting, it's very much business as usual. 

The novel bit of auth
comes into play for uploading photos. Remember the ultimate goal is to not ask grandmas and uncles to sign up, 
download, or sign in to anything. That means guests won't be authenticated as specific individuals, but we still
want assurance that not just anyone on the Internet can upload photos to your event (it doesn't 
take much imagination to see how dreadful that could be). This is really the crux of Hitchdpix, the pièce 
de résistance. We want to strike a balance between extreme ease of use, with no traditional login, while 
maintaining a level of confidence the user is someone we want involved with this event.

Our use case -- everyone gathered together in one physical location -- uniquely sets us up for some physical 
sharing of secrets, and we're able to hide the secret in plain sight using QR codes.  Every event generates 
a unique QR code, and embedded in that QR code is a JWT, signed by Hitchdpix and valid for submitting 
photos to an single event.

For example, I created an event called "Rehearsal Dinner". For that event, Hitchdpix generated this QR code:

![qrcode](/assets/images/hitchdpix-intro/dinner_qr.png)

You can scan it (whip out your phone's camera), and see that embedded in the QR code is a rather 
lengthy URL like the following (_I removed the event, so it won't actually work by the time you're reading 
this, but you get the idea._):

```
https://www.hitchdpix.com/pics/c9e63ca0-037c-11ec-a501-7f182f23433f?tok=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOWU2M2NhMC0wMzdjLTExZWMtYTUwMS03ZjE4MmYyMzQzM2YiLCJ0eXBlIjoiZXZlbnQiLCJpYXQiOjE2Mjk2NTk1MDMsImV4cCI6MTYzNzQzNTUwM30.<omitted signature>
```

So in the QR code we have a URL, and in the URL we have a JWT:

![qrcode](/assets/images/hitchdpix-intro/decoded_jwt.png)
_:point_up: There's no reason other than size we haven't specified `aud` and `iss` for the token, both as Hitchdpix. 
It's typically best practice, but in our case Hitchdpix only accepts tokens it both issued and signed, and fewer
characters makes the QR codes more robust._

Every event is assigned a GUID, and every JWT (by extension, every QR code) uses that GUID to grant 
write-only access to exactly one event. The JWTs are signed, issued by and for Hitchdpix. When a user scans
the QR code, they are automatically authenticated and authorized by Hitchdpix to submit photos for that 
event, and directed straight to the page that lets them select the photos they'd like to share.

The end result is a secret that's so easily shared with guests they won't even know they have it (think of codes 
on small placards at the bar or as a table centerpiece). Just point a smartphone camera at the QR code, and 
from there you're directed right to Hitchdpix and authorized for submitting to the event :boom:. This 
workflow provides cryptographic certainty that any-old-jerk on 
the Internet can't upload pics of their unmentionables (of course assuming they don't also have the QR 
code, which itself is reasonably likely to end up on social media, so it's a fair concern :see_no_evil:).

## Other Nifty Features

### Photo Filtering with Vision API
Hitchdpix uses [Google's Vision API](https://cloud.google.com/vision/docs/detecting-safe-search) to detect illicit 
uploads and, if detected, discards them with a message to the admins. This is a feature that can be 
toggled per event, to allow for the possibility that the AI incorrectly flags photos, or 
that some soirees may really be (acceptably and on a case-by-base basis) racier than others. :cop: We don't judge. 

### Downloading Images
Downloading all the images for an event is actually a bit tricky. They should be zipped to download as a single file,
but GAE doesn't have the RAM or disk space to do that "locally". Instead, Hitchdpix opens a series of file streams 
to the source photos, along with a write stream to a new file in another storage bucket, and simply acts as the 
compute tying the two together, reading from source files and writing them to the destination zip.

The write is actually done to a temporary file, and then moved to the final location. This lets Hitchdpix do the 
bundling atomically and only once. Multiple requests to create the same zip won't trigger multiple actions, and
Hitchdpix doesn't do partial writes directly to the downloadable zip, so in-flight requests for the previous 
bundle still work. Further, unless there are new pics for the event, Hitchdpix won't regenerate the zip at all.

### Et Al.
There's a few other notable features and tooling we built to test and maintain this thing.

* Postman library for automated system tests
* Postman library for the admin API
* Kinda proud of the icon I made (it's in the banner image on this page)
* Slack integration for errors and for contacting us via [hitchdpix.com/contact](https://www.hitchdpix.com/contact)

# Demo
Here's a demo that's a bit out of date, originally recorded more than a year ago. The UI has evolved, but all 
the principals remain! 

<iframe width="560" height="315" src="https://www.youtube.com/embed/RaPVGe1je-g" title="YouTube Hitchdpix Demo" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# Future Work
It's been a while since I've worked on this project, not because I lost interest, just because of all the competing
priorities in life. In the last year, we moved out of state, I got a new job, 
raced another bike season, and we had a baby girl. It's been busy, and the last one especially makes me
question whether I'll choose to pick this back up anytime soon.

But if I do, the most important new feature would be better handling of bulk uploads. Right now, all uploads 
are processed by Node.js running on GAE, and from there copied to storage. The number of photos a user can upload at 
once is a configurable option for Hitchdpix itself, but it's overly constrained by the 32Mb max payload for 
[Google's GAE quotas](https://cloud.google.com/appengine/docs/flexible/nodejs/how-requests-are-handled#request_limits).
With modern smartphones, that's about 5-9 uncompressed photos at a time. Instead, we should have the client send it 
directly to storage via [signed URLs](https://cloud.google.com/storage/docs/access-control/signed-urls) and bypass
the compute. We'd add a couple more steps to build an event-driven pipeline of processing uploads (so we can still support
use of the Vision API, checking file types, Hitchdpix quotas, etc), but it's the right way to go.

Beyond that, there's a million directions we could go with Hitchdpix. Like it doesn't have to be specific to weddings,
maybe it'd be useful at seminars or corporate outings. It could be monetized by offering an order of some physical gift with the 
submitted image ("wouldn't the bride look amazing on a 30"x30" physical canvas mailed straight to her 
door?! :bride_with_veil:"), or by enabling support for other media, like videos. If I get back to it, the 
possibilities are exciting.

Check it out at [https://www.hitchdpix.com](https://www.hitchdpix.com).
