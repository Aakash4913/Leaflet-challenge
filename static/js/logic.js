// Creating the map object
var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  //Loop through https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson


var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"



function getColor(depth) {

  //this is to get diff colors depending on the depth of the earthquake
    if (depth <= 10) {
        return "#08E800";
    } else if (depth > 10 && depth <= 30) {
        return "#FFFE99";
    } else if (depth > 30 && depth <= 50) {
        return "#FFD680";
    } else if (depth > 50 && depth <= 70) {
        return "#F28D30";
    } else if (depth > 70 && depth <= 90) {
        return "#FF7578";
    } else if (depth > 90) {
        return "#FF4500";
    }
}


d3.json(queryUrl).then(function(data) {
//we are looping through the Json file of the queryURL here
    for (var i = 0; i < data.features.length; i++) {
    var earthquakes = data.features[i]
    var coord = earthquakes.geometry.coordinates
    var magnitude = earthquakes.properties.mag
    var timestamp = earthquakes.properties.time
        let date = new Date(timestamp);
        let humanReadableDate = date.toLocaleString();  
    var depth = earthquakes.geometry.coordinates[2]

    //the size of the circle will be determined by this formula 
    var size = magnitude * 4
    var markerColor = getColor(depth);

    //in the marker variable we are getting our coordinates and putting together the variables we made earlier
      //in the popup we are giving some info when we hover over the earthquake circle on the map 
    var marker = L.circleMarker([coord[1],coord[0]], {
        radius: size,
        color: markerColor,
        fillOpacity: 0.5
    }).bindPopup(`<h3>${earthquakes.properties.title}</h3>
                <hr>
                <p><b>Location:</b> ${earthquakes.properties.place}</p> 
                <p><b>Time:</b> ${humanReadableDate}</p>
                <p><b>Magnitude:</b> ${magnitude}</p>
                <p><b>Depth:</b> ${depth}</p>
    `).addTo(myMap);
    
    }
      // Creating the legend
      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function () {
          var div = L.DomUtil.create('div', 'info legend');
          var labels = [" -10-10 ", " 10-30", " 30-50 ", " 50-70 ", " 70-90 ", " 90+ "];
          var ranges = ["#08E747", "#FFFF00", "#FFD580", "#F28C28", "#FF7518", "#FF4433"]
          var legendInfo = "";
          labels.forEach(function(label,i) {
              var color = ranges[i];
              legendInfo += `<div class='legend-color-box' style='background-color: ${color}'></div><span>${label}</span><br>`;
          });
          div.innerHTML = legendInfo;
          return div;
      };      

legend.addTo(myMap);

})


