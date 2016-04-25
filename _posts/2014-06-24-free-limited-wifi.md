---
layout: single
title: Free (Limited) WiFi
author: steve_jarvis
excerpt: "Many public hotspots offer a short period of free access before requiring
payment. It may be possible to keep your free period going, though."
tags: [wifi, airports, hotspot]
comments: true
---

Internet access should be a universal public right darn it, but until everyone agrees with me we'll have to band together to make it as available as possible. Tonight I'm traveling through O'Hare airport, which, at least right now, offers only 20 minutes of complimentary WiFi. After the initial 20 minutes patrons are required to cough up a fee to continue use.

The hotspot at O'Hare (and Baltimore, and probably many others) tracks who's used their free 20 minutes by associating a MAC (Media Access Control) address. Your laptop/phone/tablet has a default MAC address that's associated with the network card and used to uniquely identify you, but it's editable. When you change it, your computer looks like a totally different, unknown machine to the outside world. Then you can reconnect and continue scraping Facebook for puppy pictures.

{% highlight bash %}
$ networksetup -setairportpower en0 off
$ sudo ifconfig en0 ether `openssl rand -hex 6 | perl -pe 's/([^\n]{2})/$1:/g' | rev | cut -d: -f2-`
$ networksetup -setairportpower en0 on
{% endhighlight %}

This is specific to a MacBook Pro running OS X (since it assumes en0 is the active interface and networksetup is the wireless controller). The idea is universal, though, one would only need to modify based on the local applications. The idea is to turn off the wireless card, assign a random MAC address to the interface (of the form "12:34:56:78:90:ab"), and turn the card back on. When re-associated with the access point the machine appears as a brand new visitor. The bash/perl combo is hacky, but, ironically, I don't have internet access right now (on the actual plane) and this is the best one-liner I conjured up.