---
layout: single
title: New Playcounts from an Old iPod
author: steve_jarvis
excerpt: "What to do when your Mac crashes and all your beloved stats are stuck on an iPod."
tags: [iTunes, iPod, play counts, hacks]
comments: true
---

I found myself with a recent iTunes library and a long lost iPod. This is how I updated each to reflect the grand total play counts in the current library.

A year ago my Mac crashed. I had the music backed up, but restoring the files doesn’t include the metadata. In this year I’ve added new songs and lots of plays, and having playlists based on play counts had me wishing for a more comprehensive representation of the all-time stats. It’s also just cool information to have.

So with the old iPod, new MacBook, and this AppleScript the world can be right again. Copy this script to

~/Library/iTunes/Scripts/UpdatePlayCounts.scpt

If Scripts doesn’t exist, make it. Hook up the iPod, select all the songs on it, and choose this script from the iTunes scripts menu. Small edits could also be made to support ratings, last played, etc. Beware though, I have all of 2 hours experience writing AppleScripts, so who knows… This worked wonderfully for me on OS X 10.8 and iTunes 11.

{% highlight applescript linenos %}
-- The MIT License (MIT)
--
-- Permission is hereby granted, free of charge, to any person obtaining a copy
-- of this software and associated documentation files (the "Software"), to deal
-- in the Software without restriction, including without limitation the rights
-- to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
-- copies of the Software, and to permit persons to whom the Software is
-- furnished to do so, subject to the following conditions:
--
-- The above copyright notice and this permission notice shall be included in
-- all copies or substantial portions of the Software.
--
-- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
-- IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
-- FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
-- AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
-- LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
-- OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
-- THE SOFTWARE.

tell application "iTunes"
    set trackList to get selection

    repeat with sourceTrack in trackList
        set matchKeys to (get {name, artist, album} of sourceTrack)
        set additionalPlays to (get played count of sourceTrack)

        set libraryList to (every track of playlist "Library" whose ¬
            ((name is item 1 of matchKeys) ¬
                and (artist is item 2 of matchKeys) ¬
                and (album is item 3 of matchKeys)))

        repeat with destTrack in libraryList
            if (additionalPlays is not equal to missing value) then
                set currentPlays to (get played count of destTrack)
                set newPlayCount to currentPlays + additionalPlays
                set played count of destTrack to newPlayCount
            end if
        end repeat
    end repeat
end tell
{% endhighlight %}
