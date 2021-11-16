---
layout: single
title: Postfix from Behind Comcast's Big Dumb Head
author: steve_jarvis
excerpt: "Comcast residential accounts are quite restricted, but it's still
possible to run a personal mail server."
tags: [mail, linux, hacks]
comments: true
---

Running a server and hosting this site gives me the warm fuzzies, but I'm not about to pay $70/month for a static IP address and unlocked ports 25, 587, 80, 22 etc.<sup>[1]</sup> Most of that isn't actually relevant, but the only way to get email out without a business account is via proxy through Comcast's servers. Port 25 isn't supported at all, which is common practice and probably a good idea (port 25 doesn't require authentication and is a common destination for spammers).

So, to use Postfix from a residential Comcast account, set Comcast as the relay host in the Postfix config. By default, Postfix attempts to send mail directly to the destination, but Comcast doesn't allow that, so it instead needs to be configured to route deliveries through Comcast.<sup>[2]</sup>

#### /etc/postfix/main.cf
{% highlight bash %}
relayhost = [smtp.comcast.net]:587
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl/passwd
smtp_sasl_security_options =
{% endhighlight %}

Now dig up those dusty Comcast credentials and add them to the file set for "smtp_sasl_password_maps".

#### /etc/postfix/sasl/passwd
{% highlight bash %}
smtp.comcast.net        username@comcast.net:password
{% endhighlight %}

Set the permissions on the "passwd" file to 600, tell postmap about it, reload Postfix and all should be happy. Huge thanks to the article at Just a Theory, it almost solely got me through the setup.<sup>[3]</sup>

### References:

* 1 - Comcast Business Internet, <a href="http://business.comcast.com/internet/business-internet/plans-pricing" target="_blank">http://business.comcast.com/internet/business-internet/plans-pricing</a>
* 2 - Postfix Basic Configuration, <a href="http://www.postfix.org/BASIC_CONFIGURATION_README.html" target="_blank">http://www.postfix.org/BASIC_CONFIGURATION_README.html</a>
* 3 - Just a Theory: Getting Postfix to Send Mail from a Comcast Network, <a href="http://justatheory.com/computers/mail/postfix-and-comcast.html" target="_blank">http://justatheory.com/computers/mail/postfix-and-comcast.html</a>
