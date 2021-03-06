
//2. Add a base map.
//  var OpenStreetMap_CH = L.tileLayer('https://tile.osm.ch/switzerland/{z}/{x}/{y}.png', {
//    maxZoom: 18,
//   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(mymap);


var hideLabel = function(label){ label.labelObject.style.opacity = 0;};
var showLabel = function(label){ label.labelObject.style.opacity = 1;};
var labelEngine = new labelgun.default(hideLabel, showLabel);
var labels = [];

// 18. define the coordinate reference system (CRS)
mycrs = new L.Proj.CRS('ESRI:102003',
    '+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=37.5 +lon_0=-96 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs ',
    {
        resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1] // example zoom level resolutions
    }
);


var mymap = L.map('map', {
    crs: mycrs, // 19. assign the custom crs to the crs option. change the zoom levels due to the change of projection.
    center: [39.729939, -101.293303],
    zoom: 1, // we choose zoom level 3
    maxZoom: 100,
    minZoom: 0.1,
    detectRetina: true});

// 3. Add airport GeoJSON Data
// Null variable that will hold cell tower data
var airports = null;



// 4. build up a set of colors from colorbrewer's dark2 category
var colors = chroma.scale('PiYG').mode('lch').colors(2);

// 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 2; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

airports= L.geoJson.ajax("assets/airports.geojson", {
    // assign a function to the onEachFeature parameter of the airports object.
    // Then each (point) feature will bind a popup window.
    // The content of the popup window is the value of `feature.properties.AIRPT_NAME`
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.AIRPT_NAME);
    },
    pointToLayer: function (feature, latlng) {
        var id = 0;
        if (feature.properties.CNTL_TWR == "Y") { id = 0; } // Airports with a control tower
        else { id = 1;} // // Airports without a control tower
        return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-' + (id + 1).toString() })});
    },
    attribution: '| Airports Data &copy; USGS | Base Map &copy; CartoDB '
}).addTo(mymap);


// 6. Set function for color ramp

colors = chroma.scale('BrBG').mode('hsl').colors(9); //colors = chroma.scale('OrRd').colors(5);

function setColor(count) {
    var id = 0;
    if (count > 50) { id = 0; }
    else if (count > 45 && count <= 50) { id = 1; }
    else if (count > 40 && count <= 45) { id = 2; }
    else if (count > 35 && count <= 40) { id = 3; }
    else if (count > 30 && count <= 35) { id = 4; }
    else if (count > 25 && count <= 30) { id = 5; }
    else if (count > 20 && count <= 25) { id = 6; }
    else if (count > 15 && count <= 20) { id = 7; }
    else  { id = 8; }
    return colors[id];
}


// 7. Set style function that sets fill color.md property equal to airport density
function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}




// Create a label for each state.and Add states polygons
var states = null;
states = L.geoJson.ajax("assets/us-states.geojson", {
    style: style,
    onEachFeature: function (feature, label) {
        label.bindTooltip(feature.properties.name, {className: 'feature-label', permanent:true, direction: 'center'});
        labels.push(label);
    }
}).addTo(mymap);


// 9. Create Leaflet Control Object for Legend
var legend = L.control({position: 'bottomleft'});

// 10. Function that runs when legend is added to map
legend.onAdd = function () {

    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b> Airports with Control Towers </b><br />';
    div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p>Y</p>';
    div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p>N</p>';

    div.innerHTML += '<hr><b>Num of Airports in each State<b><br />';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> >50</p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 45-50</p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p> 40-45</p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p> 35-40</p>';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p> 30-35</p>';
    div.innerHTML += '<i style="background: ' + colors[5] + '; opacity: 0.5"></i><p> 25-30</p>';
    div.innerHTML += '<i style="background: ' + colors[6] + '; opacity: 0.5"></i><p> 20-25</p>';
    div.innerHTML += '<i style="background: ' + colors[7] + '; opacity: 0.5"></i><p> 15-20</p>';
    div.innerHTML += '<i style="background: ' + colors[8] + '; opacity: 0.5"></i><p> <15</p>';

    // Return the Legend div containing the HTML content
    return div;
};

// 11. Add a legend to map
legend.addTo(mymap);

// 12. Add a scale bar to map
//  var scale = L.control.scale({position: 'bottomright'}).addTo(mymap);

// 13. Add a latlng graticules.
L.latlngGraticule({
    showLabel: true,
    opacity: 0.2,
    color: "#000000",
    zoomInterval: [
        //{start: 2, end: 7, interval: 2},
        // {start: 8, end: 11, interval: 0.5}
        {start: 2, end: 4, interval: 6},
        {start: 4, end: 6, interval:4},
        {start: 6, end: 8, interval: 2},
    ]
}).addTo(mymap);

// 16. create an addLabel function to dynamically update the visible labels, aiming to avoid the lable overlap.

function addLabel(layer, id) {

    // This is ugly but there is no getContainer method on the tooltip :(
    var label = layer.getTooltip()._source._tooltip._container;
    if (label) {
        // We need the bounding rectangle of the label itself
        var rect = label.getBoundingClientRect();

        // We convert the container coordinates (screen space) to Lat/lng
        var bottomLeft = mymap.containerPointToLatLng([rect.left, rect.bottom]);
        var topRight = mymap.containerPointToLatLng([rect.right, rect.top]);
        var boundingBox = {
            bottomLeft : [bottomLeft.lng, bottomLeft.lat],
            topRight   : [topRight.lng, topRight.lat]
        };

        // Ingest the label into labelgun itself
        labelEngine.ingestLabel(
            boundingBox,
            id,
            parseInt(Math.random() * (5 - 1) + 1), // Weight
            label,
            label.innerText,
            false
        );

        // If the label hasn't been added to the map already
        // add it and set the added flag to true
        if (!layer.added) {
            layer.addTo(mymap);
            layer.added = true;
        }
    }
}

// 17. We will update the visualization of the labels whenever you zoom the map.
mymap.on("zoomend", function(){
    var i = 0;
    states.eachLayer(function(label){
        addLabel(label, ++i);
    });
    labelEngine.update();
});


