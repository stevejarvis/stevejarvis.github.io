---
layout: single
title: BSidesLV '26 - Trust No Agent
author: steve_jarvis
excerpt: Identity with no central authority, open comms, and further actions authorized by FGA.
tags: [security, fga, openfga, atproto, bluesky, agent security, ai auth, ai]
comments: true
header:
  overlay_color: "#000"
  overlay_filter: "0.4"
  overlay_image: /assets/images/bsideslv26/atproto-fga-system.jpg
  caption: "Live at the Tuscany"
toc: false
---

One year TO THE DAY from [last year](../bsideslv-credential-chaos/). Now that I'm looking at last year's post I think I actually wore the same t-shirt. 

Compared to last, this talk was less "security best practice", more "what if we did this?" And it was heavy on the demo. The demo may have accounted for only 5 min of the talk, but it consumed more like 90% of the prep. Both the more "theoretical" angle of the talk and demo I had a lot of fun with. And huge thanks to my friend [Becki](https://bsky.app/profile/beckitrue.com), for instigating the whole thing and doing it together.

## Demo Code
The code is all here: [https://github.com/beckitrue/atproto-agents](https://github.com/beckitrue/atproto-agents)

And our agents' plays are forever on Bluesky: [go.bsky.app/BKtUVcq](go.bsky.app/BKtUVcq)

## Talk Recording
:point_right: [Here on YouTube](https://www.youtube.com/live/K9tDYG4dMSY?t=4230s).

## What's This All About?

The gist is we're interested in using ATProto to power authentication for "public" AI Agents (those not within any existing domain or identity mgmt), as well as public and verifiable messaging, and OpenFGA for authorization. It allows for the identity to be portable, untethered to any specific authority, and application owner still controls authz on the system they own.

> Speech is free, authority is managed.

<figure class="full">
    <a href="/assets/images/bsideslv26/atproto-fga-system.jpg"><img src="/assets/images/bsideslv26/atproto-fga-system.jpg"></a>
    <figcaption>Diagram of full system, all game components that make this go.</figcaption>
</figure>

The diagram depicts what we've built for the demo, and how things flow. Agents get a JWT from their PDS and present that to the engine. The engine resolves the right signing key from the DID document in the PLC, validates the JWT to confirm that player really holds the private key for the DID they claim to be, and checks authorization against OpenFGA. As gameplay moves, the engine updates the FGA tuples to reflect the current state, programmatically enforcing the right gameplay throughout. Anything can be posted to the ATProto firehose, but only allowed actions at the right time get accepted to the game.

The talk went really well. The live demo failed to launch twice on stage, I could (almost) not believe it, we knew the internal state management was a bit finicky but I _knew_ it was primed and ready to rock :laughing:. Third time is the charm, though. 

### SPIFFE

Three different follow-up convos asked "what about SPIFFE?" And right on, that's a clear follow-up question I half-anticipated. I felt like this talk was a very packed 30 minutes of tech (with ATProto and FGA being big topics that'd be new to many, and we knew we'd also be explaining Codenames gameplay) so last night I decided to cut SPIFFE from the script. It felt like too much, one too many things to introduce.

SPIFFE has stronger workload binding than what we presented today, this idea isn't competing there. That process could _also_ get an ATProto identity if it wants to play in that network. There's no "firehose" concept or publicly verifiable records built into SPIFFE (meaning ATProto records are verifiable artifacts a stranger can audit later, SVIDs authenticate connections within that trust boundary). SPIFFE federates with bundle exchanges, ATProto federates with no prior relationship. There's always a keypair, some of the interesting questions are who holds it, how'd it get there, and who can verify against it. I think there's a picture where these are complementary technologies, not competing. 

If we give this talk again anywhere I'll include it directly, since clearly there's interest in how it fits into the discussion. (And we _were_ asked to give this talk again, which felt really nice :heart_hands:)

<figure class="half">
    <a href="/assets/images/bsideslv26/me-becki-bsides.jpeg"><img src="/assets/images/bsideslv26/me-becki-bsides.jpeg"></a>
    <a href="/assets/images/bsideslv26/spiffe-strike.jpeg"><img src="/assets/images/bsideslv26/spiffe-strike.jpeg"></a>
    <figcaption>Becki and I pre-talk. And my decision to not talk about SPIFFE, struck it out the night before, and it was definitely the most popular follow-up after we wrapped.</figcaption>
</figure>



## The Full Original CFP

Note the CFP describes Auth0 M2M. We built that, then found service auth + FGA left the IdP nothing to do (for this scope). The talk covers the pivot and where/why the full IdP comes back into play.

For now you can see a description of this talk on the [BSidesLV site here](https://bsideslv.org/talks#11f14b2f-f0fa-782e-9b45-5c176c4ed1ff) (I don't know if this link will work forever), and the full original CFP is this...

> Trust No Agent: Cryptographic Identity and Verifiable Messaging for AI

> Common Ground, Tuesday 11:00-11:30, Florentine F

> Multi-agent AI systems are proliferating fast, but who is the agent? Most deployments rely on TLS, API keys, and bearer tokens, with no portable identity, no message attribution, and no audit trail. When one agent tells another to take an action, the receiver has no additional verification the sender is who it claims to be. This talk demonstrates a practical stack for solving both problems: Auth0 Machine-to-Machine (M2M) applications for scoped API access, paired with ATProto (the protocol underlying Bluesky) for cryptographic, publicly verifiable agent identity and messaging. Each agent gets a DID and a secp256k1 keypair. Its public key lives in Auth0 client_metadata. Every message is a signed ATProto record, verifiable by anyone without trusting a central authority. To make this observable, we built a live demo: two teams of AI agents play Codenames. Audience members watch a real-time feed of agent deliberation records stream over ATProto; each one signed, DID-attributed, and auditable. You'll watch agents disagree, defer to each other, and guess wrong; all with verifiable authorship. 
