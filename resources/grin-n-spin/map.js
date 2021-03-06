var trips = [
  {
    "brewery":"Breckenridge Brewery",
    "distance":16.8*2,
    "riders":["Steve", "Allie", "Chris"],
    "image": "breckenridge-9-3.jpg",
    "date":new Date(2016, 9, 3),
    "lat":39.593721,
    "lon":-105.023341,
    "notes": "The first trip of the tour, before the tour was officially the tour!",
    "gpx": "breckenridge-9-3-2016.gpx"
  },
  {
    "brewery":"Denver Beer Co",
    "distance":5.5*2,
    "riders":["Steve", "Allie", "Chris", "Rachel"],
    "image": "denver_beer_co_2_18.jpg",
    "date":new Date(2017, 2, 18),
    "lat":39.758234,
    "lon":-105.007370,
    "notes": "An unplanned stop, but we definitely rolled up on bikes and counting it.",
    "gpx": "denver_beer_co_cruise_2_18_2017.gpx"
  },
  {
    "brewery":"TRVE Brewing Co",
    "distance":6.3*2,
    "riders":["Steve", "Allie", "Jenny", "Bailey"],
    "image": "trve_3_4.jpg",
    "date":new Date(2017, 3, 4),
    "lat":39.719919,
    "lon":-104.987686,
    "notes":"Yeah, the route is correct. 4th brewery is the charm, apparently vertical WI IDs are tricky to get served with.",
    "gpx": "trve_brew_co_3_4_2017.gpx"
  },
  {
    "brewery":"Green Mountain Beer Company",
    "distance":30.3,
    "riders":["Steve", "Rachel", "Chris"],
    "image": "green_mtn_4_16_2017.jpg",
    "date":new Date(2017, 4, 16),
    "lat":39.669945,
    "lon":-105.113684,
    "notes":"First 'official' stop of the tour, in the sense we actually planned it and said that's what it's for. And Platson got new wheels!",
    "gpx": "green_mtn_4_16_2017.gpx"
  },
  {
    "brewery":"Station 26 Brewing Co",
    "distance":16.3,
    "riders":["Steve", "Rachel", "Chris"],
    "image": "station26_4_22_2017.jpg",
    "date":new Date(2017, 4, 22),
    "lat":39.769584,
    "lon":-104.90598,
    "notes":"To Station 26 for the Wild game. And REI, cause sometimes you have some beer and wanna go to the garage sale (the pic is of some swag)",
    "gpx": "station26_4_22_2017.gpx"
  },
  {
    "brewery":"Odyssey Beerwerks",
    "distance":21.4,
    "riders":["Steve", "Rachel", "Chris", "Allie", "Sari"],
    "image": "odyssey_4_23_2017.jpg",
    "date":new Date(2017, 4, 23),
    "lat":39.800852,
    "lon":-105.058954,
    "notes":"The largest brew crew to date. First time going to the Arvada 'hood, too.",
    "gpx": "odyssey_4_23_2017.gpx"
  },
  {
    "brewery":"Mountain Toad Brewery",
    "distance":35.4,
    "riders":["Steve", "Chris", "Allie"],
    "image": "mountain_toad_5_6_17.jpg",
    "date":new Date(2017, 5, 6),
    "lat":39.758134,
    "lon":-105.224165,
    "notes":"Getting to Golden was at least twice as hard as getting back! Pretty nummy beer.",
    "gpx": "mountain_toad_5_6_17.gpx"
  },
  {
    "brewery":"Golden City Brewery",
    "distance":34,
    "riders":["Steve", "John", "Sari"],
    "image": "gcb_5_13.jpg",
    "date":new Date(2017, 5, 13),
    "lat":39.754677,
    "lon":-105.223686,
    "notes":"Hot day and a beautiful ride. Got 3 flats on the way back so I didn't make the full round trip, had to call for backup.",
    "gpx": "gcb_5_13.gpx"
  },
  {
    "brewery":"Dry Dock Brewing Co - South Dock",
    "distance":32.2,
    "riders":["Steve", "Chris"],
    "image": "dry_dock_south_7_8_17.jpg",
    "date":new Date(2017, 7, 8),
    "lat":39.652665,
    "lon":-104.81204,
    "notes":"First ride from the new place, also transported some camping equipment while we were at it. Apricot beers were favorites.",
    "gpx": "dry_dock_south_7_8_17.gpx"
  },
  {
    "brewery":"Boulder Beer Co",
    "distance":82.2,
    "riders":["Steve", "Chris"],
    "image": "boulder_beer_co_7_22_17.jpg",
    "date":new Date(2017, 7, 22),
    "lat":40.0265719,
    "lon":-105.24805650000002,
    "notes":"Longest tour trip so far! And ran out of paved trail for a couple sections.",
    "gpx": "boulder_beer_co_7_22_17.gpx"
  },
  {
    "brewery":"Breckenridge Brewery (trip #2)",
    "distance":50.2,
    "riders":["Steve", "Allie"],
    "image": "breckenridge_8_12_17.jpg",
    "date":new Date(2017, 8, 12),
    "lat":39.593113,
    "lon":-105.023949,
    "notes": "We actually planned on a bigger circle up to Dry Dock North, but weather got really nasty when we got to Littleton, so we ducked in here instead!",
    "gpx": "breckenridge_8_12_17.gpx"
  },
  {
    "brewery":"Saint Patrick's Brewery",
    "distance":55.2,
    "riders":["Steve", "Chris"],
    "image": "",
    "date":new Date(2018, 1, 13),
    "lat":39.612762,
    "lon":-105.02449999999999,
    "notes": "First ride of a new year. Went up through Denver each way, started a little chilly but turned out to be a nice day. Actually tried to go to Locavore but couldn't find it and happened to end up in Saint Patrick's parking lot while looking for it. Turned out to be a win though, great beer, and more affordable than most breweries in the area.",
    "gpx": "saint_patricks_1_13_18.gpx"
  },
  {
    "brewery":"Joyride Brewing Company",
    "distance":38,
    "riders":["Steve", "Chris", "Dave"],
    "image": "",
    "date":new Date(2018, 3, 30),
    "lat":39.753134,
    "lon":-105.053452,
    "notes": "Went out after work, it's a nice area over by Sloan's Lake. Computer died on the way back, so the route isn't complete, but you get the idea.",
    "gpx": "joyride_brew_3_30_18.gpx"
  },
  {
    "brewery":"Lost Highway Brewing Company",
    "distance":33.96,
    "riders":["Steve", "Jimmy", "Sean", "Ken"],
    "image": "lost_highway_5_28.jpeg",
    "date":new Date(2018, 5, 28),
    "lat":39.601885,
    "lon":-104.840546,
    "notes": "After the usual great Saturday morning Adventure Cycling route down to Meridian for laps, we went to recover at Lost Highway. We got there more than an hour before they were supposed to open, but we must have looked pitiful enough because she was kind enough to let us in early. Great beer and a great place.",
    "gpx": "chenango_lost_highway.gpx"
  },
  {
    "brewery":"Great Divide",
    "distance":123.39,
    "riders":["Steve", "Bill", "Amanda", "Ben", "Chris", "Allie"],
    "image": "great_divide_6_9.jpeg",
    "date":new Date(2018, 6, 9),
    "lat":39.770259,
    "lon":-104.97919,
    "notes": "The (first) big one! Five of us set out to do a whole century, and two made it the distance, but we still all managed to get to Great Divide when all said and done. The route was fun, incredibly hot though. It was well over 90 degrees for much of the way. Getting back on the bike after a couple beers at the end (just to get back home) was the hardest part. This was a great day.",
    "gpx": "great_divide_century.gpx"
  },
]

function setTotalMilesMsg(miles) {
  $("#total_mileage").text(Math.round(miles) + " total tour miles in " + trips.length + " trips to date.");
}

// draw a marker for all trips
$(document).ready(function() {
  var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2phcnZpcyIsImEiOiJjaXpieXdtM2ExYmFsMzJxaWN3bGhpMmU2In0.gKtkxDAwHZIbdLmpXPZlAA';
  // The starting coords and zoom just look good. Selecting a marker will zoom to fit the route.
  var map = L.map('map').setView([39.758234, -105.007370], 9.5);
  L.tileLayer(mapboxUrl, {
    maxZoom: 30,
    // credit our tools
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(map);

  var img_prefix = "../images/grin_n_spin/"
  var res_prefix = "../resources/grin-n-spin/"

  var mileage = 0
  trips.forEach(function(trip, i) {
    var micon = L.AwesomeMarkers.icon({
      icon: '',
      markerColor: 'darkblue',
      prefix: 'fa',
      html: (i+1)
    })
    L.marker([trip.lat, trip.lon], {icon: micon}).addTo(map)
      .bindPopup('<b><big>' + trip.brewery + '</b></big><br>' +
                 '<div style="display:flex;">' +
                 '<div style="float:left; margin:0.5em;"><a href=' + img_prefix + trip.image + '><img width=160em src=' + img_prefix + trip.image + '></a></div>' +
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
          gpxLayer = new L.GPX(res_prefix + trip.gpx,
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

    // Add to table as well
    var table = document.getElementById("trip_table");
    var row = table.insertRow(i);
    row.insertCell(0).innerHTML = i+1;
    row.insertCell(1).innerHTML = trip.brewery;
    row.insertCell(2).innerHTML = trip.date.getMonth() + '-' + trip.date.getDate() + '-' + trip.date.getFullYear();
    row.insertCell(3).innerHTML = trip.riders.join(', ');
    row.insertCell(4).innerHTML = trip.distance + ' miles';

    mileage += trip.distance;
    setTotalMilesMsg(mileage);
  })
});
