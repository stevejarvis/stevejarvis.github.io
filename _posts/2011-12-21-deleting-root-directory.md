---
layout: post
title: Deleting the Root Directory
author: steve_jarvis
excerpt: "Having some fun with the university's loaner laptop. What happens when you blow away the root directory?"
tags: [science, linux, ubuntu]
comments: true
---

Before returning NMU’s Thinkpad after fall semester I used it to perform a science experiment and watch it blow up when I ran the Holy Grail of the “don’t do that!” commands:

{% highlight bash %}
sudo rm -rf /
{% endhighlight %}

Initially, an error is thrown, convincing you that you really don’t mean it. On Ubuntu 11.10, it read:

{% highlight bash %}
rm: It is dangerous to operate recursively on "/"
rm: Use --no-preserve-root to override this failsafe.
{% endhighlight %}

So I added the –no-preserve-root option and ran it again. It flashed two notices that there was a failure to delete a subdirectory of /dev, then all the windows closed and it just stopped. The background kept the default Ubuntu purple, the mouse still moved, but that’s it. Everything else was gone.

I rebooted the machine and got a similar view, sans the mouse. It somehow still remembers the purple background though.

There weren’t any real expectations, but it was a bit of a letdown anyway. I was hoping for sparks and fire.
