$(document).ready( function(){

	$("#search, #index_form_submit").on("submit", function(event){
		event.preventDefault();
		var search_val = $("#index_form_input").val();
		var form = $(this);
		
		
		form.removeClass("wide").addClass("nav");
		console.log(search_val);
	});
	
/* delay function to only load new data if user stopped moving map*/
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

/* default */
var map;
var points;
L.mapbox.accessToken = 'pk.eyJ1IjoicHVua3Rzb25zdG5pY2h0cyIsImEiOiJGWWVEQUl3In0.P-wDrt1oIjtCCw265FjGFQ';

if (navigator.geolocation) {
	var options = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 0
	};

	function success(position) {
		zoom = 15;
		lat = position.coords.latitude;
		lon = position.coords.longitude;
		init(lat, lon, zoom);
	};

	function error(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message);
		init(52.374027, 9.739208, 13);
	};

	navigator.geolocation.getCurrentPosition(success, error, options);
}else{
	console.log("Geolocation is not supported by this browser.");
	init(52.374027, 9.739208, 13);
}


function init(lat, lon, zoom){
	// Create a map in the div #map
	map = L.mapbox.map('mask_bg', 'punktsonstnichts.i3k0ibhn', { zoomControl : true}).setView([lat, lon], zoom);
	var points_layer = L.mapbox.featureLayer().addTo(map);
	map.addControl(L.mapbox.infoControl()).addControl(L.mapbox.geocoderControl('punktsonstnichts.i3k0ibhn')).addControl(L.mapbox.legendControl());;

	points = L.featureGroup().addTo(points_layer);
	map.on('move', function(){
		console.log("move");
		delay(function(){
			get_points();
		}, 500 );
	});	
	
	var Timer;

	Timer = setInterval(newCenter, 5001);

	console.log(points);
	points.on('click', function(e) {
		alert("click");
		console.log(e);
	});
		
	get_points();
}

function newCenter(){
	// Calculate the offset
	var offsetx = map.getSize().x*((Math.random() -0.5) / 5);
	var offsety = map.getSize().y*((Math.random() -0.5) / 5);
	// Then move the map
	map.panBy(new L.Point(offsetx, offsety), {animate: true, duration: 1});
}
function get_points(){
	// Get the map bounds - the top-left and bottom-right locations.
	var bounds = map.getBounds();
	console.log(bounds);
	var data = "ne_lat=" + bounds._northEast.lat + "&ne_lon=" + bounds._northEast.lng + "&sw_lat=" + bounds._southWest.lat + "&sw_lon=" + bounds._southWest.lng;
	$.ajax({
		url: "points.php",
		type: "GET",		
		data: data,

		success: function (answer_json){
			var answer = jQuery.parseJSON(answer_json);
			if (answer.status == "ok"){
				changes = false;
				$.each(answer.points, function(index, point){
					console.log(point);
					
					found = false;
					points.eachLayer(function(existing_markers){
						if(existing_markers.options.id == point.id){
							found = true;
							console.log("marker already on map");
						}
					});
					
					if(!found){
						var marker = L.marker(new L.LatLng(point.lat, point.lon), {
							icon: L.mapbox.marker.icon({
								'marker-color': point.hex_color
							}),
							title: point.title,
							description: point.description,
							id: point.id,
							avatar : point.avatar,
							hex_color : point.hex_color,
							hex_color_hover : point.hex_color_hover
							
						});
						marker.addTo(points);
						changes = true;
					}
				});
			}else{
				// error!
			}
		}
	});
}


});