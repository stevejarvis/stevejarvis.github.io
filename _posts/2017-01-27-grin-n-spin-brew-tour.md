---
layout: single
title: Grin-n-Spin Brew Tour
author: steve_jarvis
excerpt: "Biking and beers, let's take a tour of the Denver area."
tags: [cycling, biking, denver, breweries, beer]
header:
  image: header.jpg
  teaser: grin_n_spin/bikers.jpg
comments: true
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/leaflet.css" />
<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">

There are, like, [a lot](https://www.coloradobrewerylist.com/brewery/)
of breweries in Colorado, and many are within biking distance of
Denver. We're going to start a series of fun and friendly rides to
visit some of 'em. There is no major plan, where we head on any given
day depends totally on who's coming and what the group feels like
doing. In general we roll on Saturdays, departing in the late
morning from somewhere around Cheesman Park.

The map below gives a bit of an interactive journal of where we've been so far.

<div id="total_mileage"></div>
<br>

<div style="position: relative">
  <div id="map" style="width: 100%; height: 500px"></div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/leaflet.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.2.0/gpx.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>

<script>
// Load the openstreetmap. Based off the introductory example at: http://leafletjs.com/examples/quick-start.html
var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2phcnZpcyIsImEiOiJjaXpieXdtM2ExYmFsMzJxaWN3bGhpMmU2In0.gKtkxDAwHZIbdLmpXPZlAA';
// The starting coords and zoom just look good. Selecting a marker will zoom to fit the route.
var map = L.map('map').setView([39.71, -104.97], 10);
L.tileLayer(mapboxUrl, {
  maxZoom: 30,
  // credit our tools
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(map);

var path_prefix = "../images/grin_n_spin/"
var trips = [
  {
    "brewery":"Breckenridge Brewery",
    "distance":16.8*2, "riders":["Steve", "Allie", "Chris"],
    "image":path_prefix+"breckenridge-9-3.jpg",
    "date":new Date(2016, 9, 3),
    "lat":39.593721,
    "lon":-105.023341,
    "notes":"The first trip of the tour, before the tour was officially the tour!",
    "gpx": "../resources/grin-n-spin/breckenridge-9-3-2016.gpx"
  },
  {
    "brewery":"Denver Beer Co",
    "distance":5.5*2, "riders":["Steve", "Allie", "Chris", "Rachel"],
    "image":path_prefix+"denver_beer_co_2_18.jpg",
    "date":new Date(2017, 2, 18),
    "lat":39.758234,
    "lon":-105.007370,
    "notes":"An unplanned stop, but we definitely rolled up on bikes and counting it.",
    "gpx": "../resources/grin-n-spin/denver_beer_co_cruise_2_18_2017.gpx"
  },
]

function setTotalMilesMsg(miles) {
  $("#total_mileage").text(miles + " total tour miles to date. That's " + ((miles/3000)*100).toFixed(1) + "% of the way from L.A. to Boston!");
}

// draw a marker for all trips
var mileage = 0
trips.forEach(function(trip) {
  L.marker([trip.lat, trip.lon]).addTo(map)
    .bindPopup('<b><big>' + trip.brewery + '</b></big><br>' +
               '<div style="display:flex;">' +
               '<div style="float:left; margin:0.5em;"><a href=' + trip.image + '><img width=160em src=' + trip.image + '></a></div>' +
                 '<div style="flex-grow:1; word-wrap:break-word;">' +
                   trip.notes +
                   '<ul>' +
                     '<li>' + trip.date.getMonth() + '-' + trip.date.getDate() + '-' + trip.date.getFullYear() + '</li>' +
                     '<li>' + trip.riders.join(', ') + '</li>' +
                     '<li>' + trip.distance + ' miles</li>' +
                   '</ul>' +
                 '</div>' +
               '</div>',
               {'maxWidth':'400'}
              )
    .on("click", function() {
      if(typeof gpxLayer !== 'undefined') {map.removeLayer(gpxLayer);}
      if(this.getPopup().isOpen() && trip.gpx !== 'undefined' && trip.gpx !== null) {
        gpxLayer = new L.GPX(trip.gpx,
                             {async: true,
                              marker_options: {
                                startIconUrl: null,
                                endIconUrl: null,
                                shadowUrl: null
                              }}).on('loaded', function(e) {
                                map.fitBounds(e.target.getBounds())});
        gpxLayer.addTo(map);
      }
    });
  mileage += trip.distance;
  setTotalMilesMsg(mileage);
});

</script>
