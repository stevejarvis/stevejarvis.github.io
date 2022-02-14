---
layout: single
title: Writing NTAGs for NFC in Lassie Codes
author: steve_jarvis
excerpt: The 101 of NFC and tags. Getting started with automating NTAG writes is harder than I thought it'd be.
tags: [side project, computer science, cycling, nfc, ntag, lassie]
comments: true
header:
  overlay_image: /assets/images/lassiecodes/goodboy.jpg
  teaser: /assets/images/lassiecodes/goodboy.jpg
  overlay_filter: 0.3
  caption: The best boy, demonstrating how to be safe.
toc: true
---

In the previous (and first) [post on Lassie Codes](https://imateapot.dev/lassie-codes-grand-opening/) 
I mentioned that I'd be checking out NFC to add an RFID option for stickin' emergency
contact info on your helmet. And here we are. It's not exactly hard, but I definitely found a few
ways that don't work before I got a tag to actually prompt a call to my wife. 

I was surprised
that I could not find a simple working description of tag memory for a telephone number.
(Really, top `n` hits on the search machine are filled with _"TODO"_ placeholders when it gets to 
concrete examples, like everyone started to document this but got distracted part way through.) The official
NDEF spec also costs $100, and given NFC is part of the "smart" future we're all trying to build I have a very 
strong negative reaction to putting the spec itself behind a paywall.[^1]

So after piecing together blogs, other SDK docs, and some reverse engineering, 
here's going from knowing and having nothing through writing bytes that actually trigger a call.

# Hardware
I bought a roll of [50 of the cheapest ntag213 stickers](https://smile.amazon.com/gp/product/B07GFHLZD1/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1),
which cost about $23. I also got the [Waveshare PN532 hat](https://thepihut.com/products/nfc-hat-for-raspberry-pi-pn532) for a Raspberry Pi 4 so I could write a service that 
pulls orders and writes the tags (so far it only writes tags, no greater service around it yet).
It uses the SPI interface in this setup, but there's equivalent support for I2C and UART.

# Software
The software I wrote for this is so far an unpolished 
[Python module](https://github.com/stevejarvis/lassiecodes-etcher). It makes 
use of the library provided by Waveshare[^2] to handle the lowest level protocol details and 
ndeflib[^3] for formatting NDEF records.

The confusing bit to me is that -- even though ndeflib and similar libraries have the functionality to write 
NDEF records -- the records in that format aren't useful by themselves. They have to be nested in a NDEF message,
just one of a handful of TLV structures recognized in a tag.[^4] Why don't these libs include the full TLV 
structure? I might be missing something. So in my module as it exists now, a couple custom classes wrap
the records in the necessary TLV structure when dumping the bytes to be written.

# Actual Bytes - Memory Dump
NTAG memory is organized in blocks of 4 bytes (or pages, AFAICT the terms are equivalent for NTAG2xx).
All reads and writes must be done in exactly 1 full block. So in these snippets, the chunks of memory
detailed are block by block. The format documented will be `n : 0xaa 0xbb 0xcc 0xdd`, where `n` is the block number
and `0xaa-0xdd` are the actual hex values. Specific
bytes will be referenced like `1p3b`, indicating byte 3 on page 1 (both 0-indexed). This example is of
NTAG213, which mostly matches NTAG215 and NTAG216, but there are some differences, mostly around aspects like 
the number of pages and available memory.

## Tag Serial Number
So! Here goes. The first two blocks are read-only and contain preset bytes for this tag's serial number, along with
check bytes. `0p3b` is the first check byte. So this tag's serial number is `0x0436668A816B80`.

```
0 : 04 36 66 DC
1 : 8A 81 6B 80
```

## Lock Bytes
In block 2, the first byte is the second check byte of the serial number. `2p2b` and `2p3b` are static lock
bytes, where individual bits correspond to blocks (or ranges of blocks), and when set to 1 those blocks are 
permanently read-only (cannot undo). 

_Side note, I naively started just writing blocks at first, to see if my iPhone would read them, and was 
really confused why my writes would start failing. I was writing to these last two bytes and 
inadvertently locking pages._

`2p1b` is "internal", also read-only and set at the factory. _I actually cannot figure out what it's 
for, though, anyone help me out?_
```
2 : E0 48 00 00  
```

## Capability Container
Third block is the capability container, which stores data like the memory capacity and info about. 
the tag. These bytes are _kind of_ writable, but it's the `OR` of the current value is what gets 
written, so the writing options are limited; no bit can go back from a logical 1.
```
3 : E1 10 12 00  
```

## Data Pages - Lock Control TLV
Pages `0x04-0x27` are actual data, so here starts the first TLV. `4p0b` = `0x01`, which is the lock 
control type TLV. Next byte is the length of 3. 
`4p2b` starts the value and gets a little complex for the lock control type, but it's composed of 2 
nibbles: `0xa` num of pages with a `0x0` byte offset. `4p3b` is the size of lock area, in bits.
```
4 : 01 03 A0 0C  
```

## Data Pages - Message TLV: the Phone Record
Byte `5p0b` is also interpreted as two nibbles of lock config: `0x3` bytes locked per bit and `0x4` bytes/page. 
At the next byte, `5p1b`, we finally get into the phone record. The `0x03` in `5p1b` is the message type TLV, 
`0x0F` for a payload length of 15. In `5p3b` we have the record type within the message (`0x01` for well-known)
and two flags: `0x80` for first record of the message, `0x40` for also being the final record in the message. 
And `0x01 | 0x80 | 0x40 = 0xD1`.
 
At the start of page 6 we have `0x01` for a well-known URI (again, this much match the type defined in the 
message header at `5b3p`). The `6p1b` spot is a length of `0x0B`, or 11. The UFI type is `0x55`, which 
is a constant denoting a URI record. The final byte of page 6 is `0x05`, which means we're using URI prefix 
`tel:`, a telephone number (this byte doesn't have to be used, if set to `0x00` it just means the entire
record is written, no additional prefixing. It's a helper to set prefixes without needing to write every byte,
saving a little space).

From here, most of the bytes are very straight forward! If you pull up an ASCII chart, you'll see the next 10 bytes
are `1234567890`, which is the (not actually valid) phone number programmed into this tag.

Finally, byte `9p2b` is a special record type that serves as the terminator. `0xFE` means there's no more, all done.
```
5 : 34 03 0F D1  
6 : 01 0B 55 05  
7 : 31 32 33 34  
8 : 35 36 37 38  
9 : 39 30 FE 00  
```

## Configuration Pages - Dynamic Password Protection
The value in `41p3b` is the page at which dynamic locking starts, and since we don't even have 255 pages of 
data, `0xFF` is effectively no lock. But if we _were_ locking, page 43 is the password.
It is always echo'd as `0x00`s, even when set. The same is true for `44p0b` and `44p1b`, which are the password
ack bytes.

So for example, if `44p3b` were set to `0x04` instead of `0xFF`, the tag wouldn't allow any of the data pages
to be rewritten without first providing the password defined in page 43.[^5] The first bit of `42p0b` can be set to 
logical 1 to also guard read access.
```
[... bunch of zeros removed in data ... ]
40 : 00 00 00 BD
41 : 04 00 00 FF
42 : 00 05 00 00  
43 : 00 00 00 00  
44 : 00 00 00 00 
```

And voila, there you have it. All in one shot for reference:

```
0 : 04 36 66 DC
1 : 8A 81 6B 80
2 : E0 48 00 00  
3 : E1 10 12 00  
4 : 01 03 A0 0C  
5 : 34 03 0F D1  
6 : 01 0B 55 05  
7 : 31 32 33 34  
8 : 35 36 37 38  
9 : 39 30 FE 00  
[... removed data pages of 0x00s ... ]
40 : 00 00 00 BD
41 : 04 00 00 FF 
42 : 00 05 00 00 
43 : 00 00 00 00 
44 : 00 00 00 00 
```

# Footnotes
[^1]: NXP's reference is hugely helpful and does a wonderful job explaining the function and use of each page of the tag. But that does _not_ include the format or interoperability of the data section, for which they defer to the official $100 NDEF spec. So as good as the manufacturer's spec is, it does not alleviate my gripe over the mystery and "proprietariness" of the knowledge necessary to actually use a tag in a way that's universally supported. [https://www.nxp.com/docs/en/data-sheet/NTAG213_215_216.pdf](https://www.nxp.com/docs/en/data-sheet/NTAG213_215_216.pdf)
[^2]: Available on the Waveshare wiki. [https://www.waveshare.com/wiki/PN532_NFC_HAT#Demo_codes](https://www.waveshare.com/wiki/PN532_NFC_HAT#Demo_codes)
[^3]: From PyPi. [https://pypi.org/project/ndeflib/](https://pypi.org/project/ndeflib/)
[^4]: The docs from NordicSemi got me past a couple hurdles figuring out how the records really needed to be bundled. This and reverse engineering working tags was what ultimately got me a working tag. [https://developer.nordicsemi.com/nRF_Connect_SDK_dev/doc/PR-4304/nrfxlib/nfc/doc/type_2_tag.html#data](https://developer.nordicsemi.com/nRF_Connect_SDK_dev/doc/PR-4304/nrfxlib/nfc/doc/type_2_tag.html#data)
[^5]: A four byte password doesn't live up to any common security recommendations, and isn't really meant to. Brute-forcing can prevented by setting an limit on the number of attempts in the last 3 bits of `42p3b`, but if the data is truly sensitive you'll need to manage encryption of the data itself.