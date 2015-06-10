$(document).ready( function(){
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

init();

if(navigator.geolocation) {
	var options = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 0
	};

	function success(position) {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
		map.setView([lat, lon], 14);
	};

	function error(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message);
	};

	navigator.geolocation.getCurrentPosition(success, error, options);
}else{
	console.log("Geolocation is not supported by this browser.");
}


function init(){
	// Create a map in the div #map
	map = L.mapbox.map('map', 'punktsonstnichts.i3k0ibhn', { zoomControl : true}).setView([52.374027, 9.739208], 13);
	var points_layer = L.mapbox.featureLayer().addTo(map);
	map.addControl(L.mapbox.infoControl()).addControl(L.mapbox.geocoderControl('punktsonstnichts.i3k0ibhn')).addControl(L.mapbox.legendControl());;

	points = L.featureGroup().addTo(points_layer);
	map.on('move', function(){
		console.log("move");
		delay(function(){
			get_points();
		}, 500 );
	});
	
	$(document).on({
		mouseenter: function (){
			var id = $(this).attr("data-pointid");
			var hexcolor = $(this).attr("data-hexcolor");
			var hexcolorhover = $(this).attr("data-hexcolorhover");
			$(this).css({"border-color": "#" + hexcolor }).addClass("active");
			$(this).children("").children(".point_avatar").css("background-color", "#" + hexcolorhover);
			points.eachLayer(function(existing_markers){
				if(existing_markers.options.id == id){
					existing_markers.setIcon(L.mapbox.marker.icon({
							'marker-color': hexcolorhover,
							'marker-size': 'large'
						}));
				}
			});
		},
		mouseleave: function () {
			var id = $(this).attr("data-pointid");
			var hexcolor = $(this).attr("data-hexcolor");
			$(this).css({"border-color": "" }).removeClass("active");
			$(this).children("").children(".point_avatar").css("background-color", "#" + hexcolor);
			points.eachLayer(function(existing_markers){
				if(existing_markers.options.id == id){
					existing_markers.setIcon(L.mapbox.marker.icon({
						'marker-color': hexcolor,
						'marker-size': 'medium'
					}));
				}
			});
		}
	}, '.point_elem');
	
	
	console.log(points);
	points.on('click', function(e) {
		alert("click");
		console.log(e);
	});
	
	$(document).on({
		click: function (){
			$.getScript('scripte/js/dialog.js', function(){
				$('div').dialog('show', "addpoint.php", {
					agree: "#agree",
					close: "#close",
					areyousure: "#commit",
					color: "green",
					inactivbox: true,
					callback: function() {
					  console.log("callback");
					},
					ajaxform: true,
					formname: ".dialog" // if ajaxform = true
				});
			});
		}
	}, '#add_point');
		
	get_points();
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
			update_list();
		}
	});
}
function update_list(){
	console.info("updating list");
	// Construct an empty list to fill with onscreen markers.
	var inBounds = [],
	// Get the map bounds - the top-left and bottom-right locations.
	bounds = map.getBounds(),
	// If a point is in current view. if not -> error
	pointinbound = false;
	// For each marker, consider whether it is currently visible by comparing
	// with the current map bounds.
	points.eachLayer(function(marker){
		if(bounds.contains(marker.getLatLng())) {
			pointinbound = true;
			console.log(marker.options);
			inBounds.push("<li class='point_elem' data-pointid='" + marker.options.id + "' data-hexcolor='" + marker.options.hex_color + "' data-hexcolorhover='" + marker.options.hex_color_hover + "'><div class='point_holder'><div class='point_avatar' style='background-color: #" + marker.options.hex_color + "'></div><div class='point_content'><div class='point_title'>" + marker.options.title + "</div><div class='point_description'>" + marker.options.description + "</div></div></div></li>");
		}
	});

	if(pointinbound){
		// Display a list of markers.
		$("#points_result").html("<ul>" + inBounds.join('\n') + "</ul>");
	}else{
		$("#points_result").html("<div>rezise map to see points</div>");
	}
}


});