---
layout: single
title: Where the USAC Racers At?
author: steve_jarvis
excerpt: Heatmap of USA Cycling racers who raced at least once in 2022.
tags: [side project, cycling, racers, heatmap, usac, usa cycling, project]
comments: true
header:
  teaser: /assets/images/usac_heatmap/twincities.png
  overlay_image: /assets/images/usac_heatmap/twincities.png
  overlay_filter: 0.3
  caption: Twin Cities is the hottest scene on the Mississippi river.
toc: false
---

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
  integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
  crossorigin="" 
/>
<script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
  integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
  crossorigin="">
</script>
<script src="https://leaflet.github.io/Leaflet.heat/dist/leaflet-heat.js"></script>

My buddy Dave (just Dave, you know, like Cher) is big into stats and metrics. If it can be measured in a spreadsheet and manipulated in a pivot table, he's on it. And recently we've been looking at ridership in USA Cycling (USAC) races, because the road scene hasn't been doing so hot the last few years.

Well Dave was playing around with the data on the [USAC rankings site](https://legacy.usacycling.org/events/rr.php). The gist of USAC rankings is that your best five races from the last 12 months are combined to give a racer a score. The higher ranked your competitors in a given race, the better ranking you'll receive for that race, and the best 5 rankings you earn in a 12 month window determine your actual ranking. Rankings are tracked overall, as well as grouped via age and region (_it is a cool idea, but no one really seems to care about this ranking :man_shrugging:_). 

To get on the ranking list, a racer only needs to do a single USAC event in any sanctioned discipline in the last 12 months (for our purposes here, that's crits, road, cross). Since the rankings are public and include location and age, we can basically click "_show more_" a hundred times and we have a pretty interesting database of all active racers in the country in the last 12 months.

So, that's what we did here. And the put it in a map. The elements on the map below represent a heatmap of the license holders who raced at least one USAC-sanctioned race from February 2022 - February 2023 (where the racer lives, not necessarily where they raced).

_Recommend interacting with this map on desktop._

<div id="map" style="width: 100%; height: 300px;"></div>

<div>
  <input type="checkbox" id="crit-checkbox" style="display:inline-block;margin-right:2px"/>
  <label for="checkbox" style="display:inline-block;margin-right:10px">Include Crit</label>
  <input type="checkbox" id="road-checkbox" style="display:inline-block;margin-right:2px" />
  <label for="checkbox" style="display:inline-block;margin-right:10px">Include Road</label>
  <input type="checkbox" id="cross-checkbox"  style="display:inline-block;margin-right:2px"/>
  <label for="checkbox" style="display:inline-block;margin-right:10px">Include Cross</label>
</div>

<div id="slider-container">
  <label for="slider">Min Age</label>
  <input type="range" id="min-age-slider" name="slider" min="0" max="100" value="0">
  <label for="slider">Max Age</label>
  <input type="range" id="max-age-slider" name="slider" min="0" max="100" value="0">
</div>

<script src="/assets/js/usac_heatmap/usacheat.js"></script>

One might expect this to simply look like a population heatmap of the US, and for a large part it does, but with some notable exceptions. Visually, Salt Lake City, Denver, and Chicago regions are punching above their weight. There seem to be disproportionally many racers there, when compared to strictly population density. What are they doing so right? 

<figure class="full">
    <a href="/assets/images/usac_heatmap/census_2020_map.png"><img src="/assets/images/usac_heatmap/census_2020_map.png"></a>
    <figcaption>A heatmap of wildly different style, but the most official source I found with 3 minutes of low effort searching. From <a href=https://www.census.gov/library/visualizations/2021/geo/population-distribution-2020.html>US Census</a>.</figcaption>
</figure>

Salt Lake City and Denver are known for being "athletic" and "outdoorsy" areas, so I kinda expected them to look like more popular race scenes, but... Chicago? That one surprised me. So Chicago, tell us your secrets!