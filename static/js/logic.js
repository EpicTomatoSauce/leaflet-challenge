  
// Adding tile layers
// https://docs.mapbox.com/api/maps/styles/#mapbox-styles
// create multiple tile layers for the map
let satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
})

let lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
})

let outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
})

// JSON data locations:
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
let earthquakesLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json
let tetonicplatesLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// create layergroups for earthquakes and tetonicplates
let earthquakes = new L.layerGroup();
let tetonicplates = new L.layerGroup();

// create base and overlay map objects
let baseMaps = {
    "Satellite": satelliteMap,
    "Light": lightMap,
    "Outdoors": outdoorsMap
}

let overlayMaps = {
    "Earthquakes": earthquakes,
    "Tetonic Plates": tetonicplates
}

// create myMap object with 0,0 location for center and minimum zoom (0)
let myMap = L.map("map", {
    center: [0, 0],
    zoom: 1.5,
    layers: [satelliteMap, earthquakes]
  });

// layer control
L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);