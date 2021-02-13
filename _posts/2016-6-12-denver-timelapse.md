---
layout: single
title: Denver Timelapse
author: steve_jarvis
excerpt: "Watching the days pass from the perspective of our balcony."
tags: [timelapse, iphone, vine st, denver, cheesman]
header:
  image: /assets/images/header.jpg
  teaser: /assets/images/denlapse.jpg
comments: true
---

Last updated: 05:11:36 PM, Jul 31, 2016

<figure>
  <video width="720" height="480" controls="controls">
    <source src="https://nerdster.org/static/timelapse.mp4">
  </video>
  <figcaption>
    Full loop of all images taken so far, beginning
    Monday, June 20, 2016. Images are taken every hour (except
    throughout the night) and the video is reassembled and published <del>each night
    at 11 PM</del> once-in-a-while. Perspective is looking northwest from Cheesman Park, Denver.
  </figcaption>
</figure>

Basically, this is a jailbroken iPhone running iOS 8.1.3, OpenSSH, and [Activator](http://www.cydiaios7.com/activator.html).
Images are taken at the request of a RaspberryPi sitting inside, issuing
Activator commands over SSH. <del>At 11 PM the Pi assembles the current set of images
into the video and publishes the result to this page. This is quite an intensive
process, though, it takes the Pi a while (you can see just how long by the time
stamp at top, which marks the finish time).</del> This task became simply too much
for the Pi to handle; it took 8 hours to assemble one week of images, and started
crashing before we made it to 2 weeks. So for now it will be updated occasionally,
manually. For some up-to-the-moment shots, check out [Denverlapse](https://www.instagram.com/denverlapse/)
on Instagram. The scripts, all images, versions of the timelapse, etc, can be found on
[Bitbucket](https://bitbucket.org/stevejarvis/denlapse/src).

<figure>
    <a href="../images/denlapse.jpg"><img src="../images/denlapse.jpg"></a>
    <figcaption>The workhorse, a re-purposed iPhone 4s.</figcaption>
</figure>
