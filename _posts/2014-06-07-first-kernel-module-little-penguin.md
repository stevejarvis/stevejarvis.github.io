---
layout: single
title: First Kernel Module with Little Penguin
author: steve_jarvis
excerpt: "Excited to be taking part in the Eudyptula challenge!"
tags: [linux, kernel, module]
comments: true
---

Thanks to the great people at the <a href="http://eudyptula-challenge.org/" target="_blank">Eudyptula Challenge</a>, everyone's welcome to enjoy a systematic intro to Linux kernel development. I've grown to be a low-level man at heart and was excited to hear about it. I finished the first challenge tonight on Arch, and there were a couple of unforeseen hurdles.

<h4>Syslog-ng</h4>
Little Penguin needs proof of my accomplishment, and the simplest I could think of was tailing the system message log. Syslog isn't around by default in Arch, it's been replaced by <a href="https://wiki.archlinux.org/index.php/Systemd#Journal" target="_blank">systemd's logger, journal</a>. Syslog-ng collects messages from a socket fed by journal, <a href="http://lwn.net/Articles/474968/" target="_blank">which has taken over the original /dev/log device</a>. The proper solution on Arch is surely to use journal straight away, but I'm working on "Hello World", so I ran with the traditional, well-documented syslog output.

<h4>Mail</h4>
The email correspondence with Little Penguin needs to be plain text, and I got in this game by sending a message from emacs/mu4e. I'm new to Arch, but couldn't find anything resembling "mu4e" in the repositories, so I decided to expand my horizons and try mutt. Mutt rules. I'll likely never replace OS X Mail (or similar) because drag and drop attachments and inline images are very convenient, but I can live in a shell for days and will love using mutt there.

Anyway, when it all came together it was fairly anti-climatic--it just worked. Software "just working" is cool but rare, so it surprised me, but I suppose I'm good with that.