$(document).ready( function(){
/* delay function to only load new data if user stopped moving map*/
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

var lon = 9.739208;
var lat = 52.374027;
var zoom = 17;
var off_center_lat = 9.7388977;
var off_center_lon = 52.3743373;
var marker_title = "Jim Block";
var marker_content = "2";
var img_src = 'http://localhost/Reise/images/default_images/default_avatar.png';
	
var feature = {
    "type": 'Feature',
    "geometry": {
        "type": 'Point',
        "coordinates": [lon, lat]
    },
    properties: {
        "title": marker_title,
        "description": marker_content,
		"icon": {
            "iconUrl": img_src,
            "iconSize": [20, 20], // size of the icon
            "iconAnchor": [10, 10], // point of the icon which will correspond to marker's location
            "popupAnchor": [0, -25], // point from which the popup should open relative to the iconAnchor
            "className": "dot"
        }
    }
};

// Provide your access token
L.mapbox.accessToken = 'pk.eyJ1IjoicHVua3Rzb25zdG5pY2h0cyIsImEiOiJGWWVEQUl3In0.P-wDrt1oIjtCCw265FjGFQ';
// Create a map in the div #map
var map = L.mapbox.map('map', 'punktsonstnichts.i3k0ibhn', { zoomControl : true}).setView([off_center_lon, off_center_lat], zoom);

map.addControl(L.mapbox.infoControl()).addControl(L.mapbox.geocoderControl('punktsonstnichts.i3k0ibhn')).addControl(L.mapbox.legendControl());;

if(feature !== undefined){
var locations = L.mapbox.featureLayer().addTo(map);



locations.on('layeradd', function(e) {
    var marker = e.layer,
        feature = marker.feature;
	
	if(feature.properties.icon.iconUrl != ""){
		marker.setIcon(L.icon(feature.properties.icon));
	}
});

locations.setGeoJSON(feature);

    map.featureLayer.on('click', function(e) {
        map.panTo(e.layer.getLatLng());
    });
}


map.on('move', function(){
	delay(function(){
		// Construct an empty list to fill with onscreen markers.
		var inBounds = [],
		// Get the map bounds - the top-left and bottom-right locations.
		bounds = map.getBounds();
		console.log(bounds);
		var data = "ne_lat=" + bounds._northEast.lat + "&ne_lon=" + bounds._northEast.lng + "&sw_lat=" + bounds._southWest.lat + "&sw_lon=" + bounds._southWest.lng;
		$.ajax({
			url: "points.php",
			type: "GET",		
			data: data,

			success: function (answer_json){
				var answer = jQuery.parseJSON(answer_json);
				if (answer.status == "ok"){
					$.each(answer.points, function(index, point){
					console.log(point);
						var marker = L.marker(new L.LatLng(point.lat, point.lon), {
							icon: L.mapbox.marker.icon({
								'marker-color': 'ff8888'
							}),
							title: point.title,
							description: point.description
						});
						marker.addTo(map);
					});
				}else{
					// error!
				}
			}
		});
		// For each marker, consider whether it is currently visible by comparing
		// with the current map bounds.
		locations.eachLayer(function(marker) {
		if (bounds.contains(marker.getLatLng())) {
			inBounds.push(marker.options.title);
		}
		});

		// Display a list of markers.
		console.log(inBounds.join('\n'));
	}, 1000 );
});

});