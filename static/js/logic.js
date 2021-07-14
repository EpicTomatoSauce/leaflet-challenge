 // JSON data locations:
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
var earthquakesLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json
var tetonicplatesLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";


// create layergroups for earthquakes and tetonicplates
var earthquakes = new L.layerGroup();
var tetonicplates = new L.layerGroup();

// Adding tile layers
// https://docs.mapbox.com/api/maps/styles/#mapbox-styles
// create multiple tile layers for the map
var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
})

var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
})

var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
})

// create base and overlay map objects
var baseMaps = {
    "Satellite": satelliteMap,
    "Light": lightMap,
    "Outdoors": outdoorsMap
}

var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tetonic Plates": tetonicplates
}

// create myMap object with 0,0 location for center and minimum zoom (0)
var myMap = L.map("map", {
    center: [0, 0],
    // https://docs.mapbox.com/help/glossary/zoom-level/
    zoom: 1.5,
    layers: [satelliteMap, earthquakes]
  });

// layer control
L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

// Use USGS website to retrieve earthquake information using d3.json
// Perform a GET request to the query URL
d3.json(earthquakesLink).then(function(dataEarthquakes) {
    // Once we get a response, send the data.features object to the getDataEarthquakes function
      getDataEarthquakes(dataEarthquakes.features);
    });

function getDataEarthquakes(earthquakeData) {
    // create a function for marker size based on the magnitude information in the earthquakeData
    function markersize(magnitude) {
        if (magnitude == 0) {
            return 0.1;
        }
        return magnitude * 3;
    }

    function chooseColor(magnitude) {
        // use switch to determine treatment of the magnitude against an integer scale
        switch (true) {
            case magnitude > 5:
                return "#f06b6b";
            case magnitude > 4:
                return "#f0a76b";
            case magnitude > 3:
                return "#f3ba4d";
            case magnitude > 2:
                return "#f3db4d";
            case magnitude > 1:
                return "#e1f34d";
            default:
                return "#b7f34b";
        }  
    }
    
    function styledata (feature) {
        return {
            opacity: 1.0,
            fillOpacity: 0.8,
            // base the fill color of magnitude size, of which then create a function called chooseColor to determine based on an integer scale
            fillColor: chooseColor(feature.properties.mag),
            color: "#000000",
            // use the marker size function to determine size of the radius based on the feature.properties.mag property
            radius: markersize(feature.properties.mag),
            stroke: true,
            weight: 0.3
        };
    }

    L.geoJSON(earthquakeData, {
        // https://leafletjs.com/examples/geojson/
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styledata,
        // create popups using onEachFeature and bindPopup
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h4>Location: ${feature.properties.place}</h4> <hr> Date / Time: ${new Date (feature.properties.time)} <br> Magnitude: ${feature.properties.mag}`);
        }
    // add to earthquake layerGroup then layergroup to MyMap
    }).addTo(earthquakes);
    earthquakes.addTo(myMap);

    // repeat above process to return tetonic plate geometry
// Perform a GET request to the query URL
d3.json(tetonicplatesLink).then(function(dataTetonic) {
    // Once we get a response, send the data.features object to the getDataEarthquakes function
      getDataTetonic(dataTetonic.features);
    });

function getDataTetonic(tetonicplatesData) {
        L.geoJSON(tetonicplatesData, {
            color: "#ffa500",
            weight: 2,
            opacity: 1
        }).addTo(tetonicplates);
        tetonicplates.addTo(myMap);
    }

// Set up legend
var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"), 
        magnitudeLevels = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h3>Magnitude</h3>"

        for (var i = 0; i < magnitudeLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
                magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };
    // Add Legend to the Map
    legend.addTo(myMap);
}