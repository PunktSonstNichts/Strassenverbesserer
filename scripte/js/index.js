$(document).ready( function(){
	$("#search, #index_form_submit").on("submit", function(event){
		event.preventDefault();
		var search_val = $("#index_form_input").val();
		var form = $(this);
		
		
		form.removeClass("wide").addClass("nav");
		console.log(search_val);
	});
	
	var map = L.mapbox.map('mask_bg', 'punktsonstnichts.i3k0ibhn', { zoomControl : true}).setView([off_center_lon, off_center_lat], zoom);

	map.addControl(L.mapbox.infoControl()).addControl(L.mapbox.geocoderControl('punktsonstnichts.i3k0ibhn')).addControl(L.mapbox.legendControl());;
});