---
layout: post
title: Sharing a Tmux Session
author: steve_jarvis
excerpt: Something I do just often enough to consistently forget the arguments.
tags: [linux, unix, shell, tmux, share, screen]
comments: true
image:
  feature: header.jpg
---

You:
{% highlight bash %}
tmux -S /tmp/somefile
{% endhighlight %}


Them:
{% highlight bash %}
tmux -S /tmp/somefile attach
{% endhighlight %}

Just a quick reference. Something I do just often enough to consistently forget
the arguments.
