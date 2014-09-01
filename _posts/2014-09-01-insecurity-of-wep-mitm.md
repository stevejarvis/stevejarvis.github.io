---
layout: post
title: The Insecurity of WEP Networks and How It Can Be a Big Deal
author: steve_jarvis
excerpt: "How WEP secured wireless networks can be a security risk. Portrayed by
a very real life attack vector, continuing with a man in the middle attack on an
SSL connection."
tags: [security, WEP, network, SSL, mitm]
comments: true
image:
  feature: header.jpg
---

## Take Care
If this something of interest, make sure it's explored in a safe environment in
which you have permissions to poke around. This is some cool but serious
business, and any part of it could be worth a
[5 year prison sentence and fines][legal].

The attack described here was done in a security lab at Boston University, with
the permission of the University and sanctioned by the professor. We were
granted the SSID of a WEP network and told there was "some user" making
authentication requests to "some HTTPS site", and challenged to log in to that
site as said user.

## Background of WEP and it's Vulnerability
[WEP][wep] is an algorithm for securing WiFi networks. The password used for
authentication to the network is also used to encrypt the traffic on
it, using the RC4 stream cipher. Simplistically, stream ciphers generally
work by combining the data and the key via XOR. For example, suppose the WEP
password is:

    {% raw %}
    0123456789
    {% endraw %}

and the message transmitted over the network is:

    {% raw %}
    hello (hex 0x68656c6c6f)
    {% endraw %}

The XOR operation would look like this (without the spaces, those are included
for readability):

    {% raw %}
        0000 0001 0010 0011 0100 0101 0110 0111 1000 1001 (the key)
    XOR 0110 1000 0110 0101 0110 1100 0110 1100 0110 1111 (the message)
        -------------------------------------------------
        0110 1001 0100 0110 0010 1001 0000 1011 1110 0110 (the cipher, 0x6946250be6)
    {% endraw %}

And in itself, that's great and secure. Given the result of the XOR (the cipher
text), there's no way to get the original message without knowing the key, and
no way to derive the key. Actually, a [one time pad][onetimepad] is the only algorithm
[proven to satisfy perfect secrecy][perfectsecrecy].

The issue is that the key needs to be used only one time to guarantee security.
Consider if an attacker had access to the cipher texts. If the attacker gets a
number of encrypted messages, c1 and c2, they can be used to get information
about the original messages.

    {% raw %}
    c1 XOR c2 = (m1 XOR key) XOR (m2 XOR key) = m1 XOR m2
    {% endraw %}

This can [leak a surprising amount of information][graphicalpad] about the
messages sent, and more is leaked with each additional message encrypted with
the same key. Ultimately, if any one of the messages are learned, the key is
known:

    {% raw %}
    m1 XOR c2 = key
    {% endraw %}

Once that happens, the cipher (along with the WEP authentication and secrecy)
is broken.

The designers of WEP recognized this issue, and to solve it prepended a 24 bit
initialization vector (IV) the key. The addition of an evolving IV
makes each key unique so multiple cipher texts won't leak information about the
individual messages or the key. The problem with WEP's IV, though, is that it's
only 24 bits long. On a busy network, unique IVs can be exhausted fairly
quickly, and once they're all used up repeats start, and the security
falls to the same issue as not using IVs at all.

Despite WEP being deprecated in 2004 and hackable by hobbyists, it's still used
fairly widely. Two of the six networks within range of my couch are secured by
WEP, for example.

## The Setup and Goal
So imagine there's a WEP wireless network, and on it a user is making requests to a
secure server over [SSL][ssl]. In this case, the user is protected by two layers
of security (once by WEP, again by SSL). The user is not a technical person, and
wouldn't think twice about clicking through [annoying certificate warnings][untrustedcert]
to get where they were trying to go. Assume their destination in this example is
their bank, hosted at "https://notarealbank.com".

The goal of the attacker (our perspective) is to penetrate the user's network,
get their username and password for "notarealbank", and steal their hard earned money.

### Gaining Access to the Network
Using the above outlined vulnerability of WEP, an attacker can learn the
password for the network. Once the IVs roll over and start being reused, XOR'ing
cipher texts together can yield the base key. There's [a popular suite of tools][aircrackng] that
does all the hard work for the attacker, even, and in the lab I completed at BU
it only required about 10 minutes of effort. It was an alarmingly quick process.

### Playing Who's Who - Continuing with the MITM Attack
Once the attacker is on the network he's privy to inspecting all the other
traffic on the network. Even SSL encrypted traffic sends the IP header in
plain text, which includes the address of the sender and receiver. Patterns in
the traffic can ultimately lead to the recognition of:

* Which IP address represents the user
* Which IP address represents "https://notarealbank.com"

A very popular method to glean this information is by analyzing traffic with
[Wireshark in promiscuous mode][promiscuous]. By default, Wireshark only
captures packets sent from or destined to the host machine, but promiscuous mode
captures everything on the network (consider what this means for public hotspots).

Learning who's who can be sped up by simple trial and error, as well. For
simplicity, assume the user is the only active member of the network, and he's
only making requests to "https://notarealbank.com". That means there's a single
SSL conversation, but no direct way to tell which participant is the user and which is the
bank. They can be immediately identified by simply making an HTTP request to
each address and seeing who responds (unless the user is actually running an HTTP
server obviously, but that is very unlikely).

### Getting Traffic Destined for the HTTPS Server
Once the IP address of the bank is recognized, it's time to intercept the
traffic. IP addresses are allocated on a local network by the
[address resolution protocol (ARP)][arp]. Basically, ARP works by the router
asking all the computers on the network "Hey guys, who has address
192.168.1.14?" and the computer who is using that address sends a response
saying, "Ooh that's me!". Then, whoever claimed the address gets the messages
marked for that destination.

ARP responses can also be sent unsolicited, though, and generally just work on
the "honor system". So when the attacker wants to
receive the requests destined for the bank's website and learns the IP address
being used by the bank, he can just start spamming the router claiming that he
actually owns the address. In practice, we found it only took about 10 seconds
for the ARP changes to propagate through the local network until we started receiving
messages meant to go to the bank's site. This is a process called [ARP spoofing][arpspoofing].

### Analyzing the Traffic Destined for the HTTPS Server
So now the attacker is getting all kinds of sensitive messages about the user's
banking, but they're still protected by SSL, which is currently (hopefully) in
use by every website online that handles even remotely personal information. All
the attacker can see is what's available in the plain text IP header, but none
of the actual message data.

To get the encrypted good bits, the attacker needs to fully impersonate the bank
and set up an encryption key with the user. This requires completing the
[SSL handshake][sslhandshake] with the user, which is especially hard because
the handshake requires the bank's [certificate][publickeycert], signed by its private key, which,
obviously, the attacker does not have. This is one of the more complex steps of the
attack, but again, there are tools that do most of the work for the attacker. In
this case, the tool is [SSL Sniff][sslsniff].

SSL Sniff works by taking a [signing certificate][publickeycert] and generating
a certificate that appears to have been issued to the bank, proving it's
identity (or in this case, forging the identity of the hacker). This creates a
technically valid certificate, which would authenticate the attacker's computer
as "https://notarealbank.com". The only saving grace of the user
is that every major browser will raise a huge red flag when it sees a
certificate signed by an unknown identity, as this one is. Legitimate
certificates will, at some point up the chain, bear the signature of a known
[certificate authority][certauth] (so notice, any idea of identity online goes
out the window if a CA is compromised).

Even though the browser does its best to keep the user safe, who doesn't know 10
different people who would click "I don't care, take me there anyway" when
confronted with the warning? If the user (victim) in this scenario is one of
those people, the attacker has won and can read their correspondence with the
bank, including passwords, emails, accounts... everything. Furthermore, by
simply forwarding this information to the real "notarealbank.com", the user will
never know the difference. This is a prime example of a
[man in the middle attack][mitm], and at this point the attacker has totally won.

# Conclusion
The depicted attack has a handful of steps that go way past the issues with WEP,
but notice that WEP is the vulnerability that let the attacker get his foot
in the door; if he'd been locked out of the network like the user intended,
none of the following steps are possible. So beware of broken security algorithms,
like WEP, and pay attention to browser warnings, they can indicate significant
issues. You are implicitly placing all of your trust in your browser when
browsing the web, including it's proper identification of sites, and warnings it
issues are worth attention.

It took a fellow grad student, Will Blair, and I about 9 hours to get through
the entire attack and gain access to the secret website, authenticated as the
victim. An experienced attacker could surely perform the entire attack in a
fraction of that time, and it'd take little more than parking out front
of a house that features a WEP network and having a little patience. The
internet can be a scary place.


[wep]: http://en.wikipedia.org/wiki/Wired_Equivalent_Privacy
[legal]: http://www.law.cornell.edu/uscode/text/18/2511
[onetimepad]: http://en.wikipedia.org/wiki/One-time_pad
[perfectsecrecy]: http://www.ics.uci.edu/~stasio/fall04/lect1.pdf
[aircrackng]: http://www.aircrack-ng.org/
[ssl]: https://en.wikipedia.org/wiki/Transport_Layer_Security
[sslhandshake]: http://www-01.ibm.com/support/knowledgecenter/SSAW57_6.1.0/com.ibm.websphere.edge.doc/edge/cp/admingd118.htm%23wq178?lang=en
[untrustedcert]: https://support.google.com/chrome/answer/98884?hl=en
[arp]: http://en.wikipedia.org/wiki/Address_Resolution_Protocol
[arpspoofing]: http://en.wikipedia.org/wiki/Address_Resolution_Protocol#ARP_spoofing_and_Proxy_ARP
[sslsniff]: http://www.thoughtcrime.org/software/sslsniff/
[publickeycert]: http://en.wikipedia.org/wiki/Public_key_certificate
[mitm]: http://en.wikipedia.org/wiki/Man-in-the-middle_attack
[graphicalpad]: http://cryptosmith.com/archives/70
[promiscuous]: https://www.wireshark.org/faq.html#q7.6
[certauth]: http://en.wikipedia.org/wiki/Certificate_authority
