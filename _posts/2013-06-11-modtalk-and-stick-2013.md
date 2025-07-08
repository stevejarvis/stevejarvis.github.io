---
layout: single
title: Modtalk and STIC 2013
author: steve_jarvis
excerpt: "Presented the Modtalk compiler at STIC 2013, my first software conference."
tags: [side project, compiler, smalltalk, conference, project]
header:
  teaser: /assets/images/modtalk.png
comments: true
---

Modtalk! Today I gave a presentation at my first software conference, the Smalltalk Industry Conference. It was great and the project is, I think, something exciting to watch as it grows. Modtalk is a programming language based on standard Smalltalk–a language that lead directly to Objective-C and whose community created such things as agile development and elegant object patterns. If you’ve not heard of Smalltalk, check out a project like Pharo, a free environment for Smalltalk development. It’s free, open and inviting to curious beginners.

The inspiration for Modtalk is largely academic and it differs from Smalltalk in a couple big ways. Traditional Smalltalk is image-based, with the program development and environment residing within the same living image. Some of the core objects are instantiated through a circular meta-class arrangement, which still seems to be hardly less than magic. Modtalk uses a declarative approach which specifies some of the would be meta-circular definitions outright, cutting off the “the chicken and the egg happen together” idea of traditional Smalltalk. Modtalk also introduces modularity (Modules + Smalltalk = Modtalk), which provides namespaces and limited visibility.

<figure>
    <a href="/assets/images/modtalk.png"><img src="/assets/images/modtalk.png"></a>
    <figcaption><a href="/assets/images/modtalk.png" title="modtalk logo">
    Modtalk's logo, courtesy of @taylor_hager.</a></figcaption>
</figure>

We currently have the ability to write an equivalent of “Hello World” in Modtalk. There was a ton of effort laying the groundwork and domain pieces for the language itself, but the particularly exciting piece is the compiler. The compilation happens in two distinct phases: loading (analysis) and code generation. The loader builds a program model from the Modtalk source code and maintains that model on incremental program edits, then at code generation time the compiler creates a representation of that program model in an external language (currently C). The external representation includes base structures to run the program, like MethodDictionaries, Symbols, CompiledMethods and CodeArrays, and the runtime operates on these structures to interpret the compiled program.

I think this is an awesome project. I’m excited to already understand a bit better how modern languages work and where improvements can be made. John Sarkela deserves all the credit for this coming to life and I can’t thank him enough for his help and patience. Kurt Kilpela and Josh Friedstrom also did a lot of work implementing a runtime so we actually had a way to run our compiled program at the conference. The logo was designed Taylor Hager, an NMU art student.

Everything to do with Modtalk is under the MIT License and will be made public when it’s slightly more stable.
