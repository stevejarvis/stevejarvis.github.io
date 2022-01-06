---
layout: single
title: Lassie Codes - Chapter 1
author: steve_jarvis
excerpt: Easy emergency contact info when you're on the road.
tags: [side project, computer science, cycling, qr code, lassie]
comments: true
header:
  overlay_image: /assets/images/lassiecodes/goodboy.jpg
  teaser: /assets/images/lassiecodes/goodboy.jpg
  overlay_filter: 0.3
  caption: The best boy, demonstrating how to be safe.
toc: true
---

# The Situation
Often in group or competitive rides cyclists are encouraged to share emergency contact info, 
for obvious good reasons. Sometimes this is done by just texting phone numbers, maybe 
it's recorded during event registration, or maybe it's engraved on a bracelet. That all works, 
but it can be a bit of a PITA when contact info needs updating and potentially 
dangerous if there's one person who knows your info isn't around when you 
really need them to be.

# Lassie Codes
So imagine instead there's a spot on the helmet your riding buddies could scan with 
a regular ol' smartphone, and as soon as it's scanned the phone calls the wearer's 
emergency contact. Almost all modern smartphones do this automatically when a QR 
code is within the camera frame. 

That's what [Lassie Codes](https://www.lassie.codes) does! (Get it? Like "help Timmy's in the well"?) 
QR codes are easy to update and cheap to print. And it'll always be with you when you need
it (subject to still being in a readable state, which is a risk I think can be remediated
with a high [error correction level](https://en.wikipedia.org/wiki/QR_code#Error_correction) 
and maybe a redundant code).

<figure class="half">
    <a href="/assets/images/lassiecodes/scan.png"><img src="/assets/images/lassiecodes/scan.png"></a>
    <a href="/assets/images/lassiecodes/goodboy.jpg"><img src="/assets/images/lassiecodes/goodboy.jpg"></a>
    <figcaption>Scanning a code in the camera app on an iPhone. And Cecil modeling the safety gear.</figcaption>
</figure>

I learned next.js to write this app, and so far there's not a ton to it. You enter information
for an emergency contact, press "generate", and client-side JS turns it into a QR code, including
some helpful notes for those who might be needing to use it. If you login, then contact information is
persisted and your own name is added to the QR code. It's simple but effective.

![code](/assets/images/lassiecodes/lassie_form.png)

# Up Next for Lassie Codes
## NFC 
Thank goodness for smart friends, because in my mind this was about the vision I had for Lassie Codes.
But when I shared on Twitter, 
[Mike responded asking if I'd considered any RFID](https://twitter.com/shortwordmike/status/1477042505279496196).
Frankly it took me a minute to even wrap my head around the idea, because I was so set 
on simple printed paper codes, but it's a brilliant suggestion. NFC chips could be more robust than paper 
in weather, and likely more attractive on the helmet. There's a lot I don't know, but I had a NFC hat 
for a Raspberry Pi and 50 blank ntag chips delivered just today to start figuring it out. So stay tuned.

![tweet](/assets/images/lassiecodes/mike_tweet.png)

Engineering-wise, it also introduces a "real world" element. Lassie Codes is hosted in AWS, 
so I can certainly build services to accept orders of NFC tags, but now I have to turn these web requests 
into little mailed widgets. I'm no doubt over-engineering this in my mind already, but that's a fun
crossover to build.

## GUI and UX
I continue to slog my way through CSS 101 and can make it _kinda_ look like I want it to, but it's
never what really something I enjoy. I realize for it to be useable the UX has to at least make sense, and
current state isn't attractive, but in my mind this is about 1/100th as interesting as the NFC-related 
challenges.  So I'll get there, but also... paging interested front-end devs. :pager:
