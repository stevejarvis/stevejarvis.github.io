---
layout: single
title: BSidesLV '25 - Controlling Credential Chaos
author: steve_jarvis
excerpt: Talking about how to authenticate without secrets, at BSides Las Vegas, 2025.
tags: [kubernetes, containers, security, secrets, project]
comments: true
header:
  overlay_color: "#000"
  overlay_filter: "0.2"
  overlay_image: /assets/images/bsideslv25/talking.jpeg
  caption: "Live at the Tuscany"
toc: false
---

# Talk Resources
## Demo Code
Demo resources? That code is all here: [https://github.com/stevejarvis/bsideslv25-credential-chaos](https://github.com/stevejarvis/bsideslv25-credential-chaos).

## Talk Recording
_(Once it's published to YouTube, I'll link here)_

# What's This All About?
There's a huge amount of risk in a "typical tech stack". There's static, long-lived creds for engineer access to SaaS and infra, CICD to deploy resources, for services to authenticate to each other, and more. This talk illustates some common, real world scenarios and walks through options for improving the situation.

<figure class="full">
    <a href="/assets/images/bsideslv25/demo-diagram.png"><img src="/assets/images/bsideslv25/demo-diagram.png"></a>
    <figcaption>The final goal state of the demo, replacing all the scary red lines with calming, secure blue.</figcaption>
</figure>

## The Full Original CFP
For now you can see a description of this talk you can see on the [BSidesLV site here](https://bsideslv.org/talks#T7AHQT), but the full orginal CFP is this...

> Tired of the secret sprawl? You're not alone. This talk throws out the outdated playbook of endless key rotations and credential tracking and exposes a better way: deleting the darn secrets in the first place. Or where they can’t be deleted, choose a solution that offers better protection as a matter of course. Learn concrete 'Do This, Not That' guidance for reducing secrets-induced risk across your stack, from how your users access infrastructure to how your services themselves authenticate.
> 
> We’ll go through common use cases that traditionally require static, manually managed secrets, and give specific examples of how to move away from that model to a much safer and more maintainable architecture, where manually managed secrets are the exception, not the default.
>
> See a live demonstration of two Kubernetes clusters – one in AWS and one in Azure – securely authenticating to the other cloud provider with zero manually managed secrets. We'll dive into AWS IRSA and Azure Workload ID, showcasing how these services unlock cross-cloud access without the risk of static, privileged client credentials. You'll even get the full Terraform source code to implement this yourself, highlighting the emergent wins for resiliency and 
maintainability when your entire infrastructure is defined in code.
>
> Leave this session equipped with practical examples to immediately reduce your secrets footprint and a deeper understanding of building secure, secret-free systems.
