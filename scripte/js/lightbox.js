(function ($) {
    "use strict";
	var lastshowcalled_time = Date.now();
    var methods = {
    init : function (options) {
	console.log("init");
	
	var settings = {
		preload: true, // just to store the image before lightbox get called
		open_on_click: true // if lightbox should open on click on image
	}
	var opt = $.extend(settings, options);
	
	if(jQuery.data(document.body,"init") != true){
		$('<div id="lightbox-preload" style="margin-left: -10000px; display: none;"></div><div id="lightbox" style="display: none"><div id="lightbox-close">&times;</div><div id="lightbox-content" class="wrapper"></div></div><div id="lightbox-room" style="display: none"></div>').prependTo("body");
		$("#lightbox-close, #lightbox-room").click( function(e){
			$(document).unbind("keydown");
			$("#lightbox").fadeOut(700, function() {
				$("#lightbox-room").fadeOut();
			});
			
			e.stopPropagation();
		});
		/** Onclick handler if activated **/
		if(opt.open_on_click){
			$(".lightbox").click( function(){
				if($(this).attr("data-imgid") >= 0){
					console.log("click");
					methods.show($(this).attr("data-imgid"));
				}
			});
		}
		/** Storing image data **/
		if(opt.preload){
			var prepare_images = [];
			$(".lightbox[data-imgid]").each(function( index, element ){
				if($(this).attr("data-imgid") >= 0){
					prepare_images[index] = {};
					prepare_images[index]["id"] = $(this).attr("data-imgid");
				}
			});
			var images_json = JSON.stringify(prepare_images);
			/** Screen resolution for best images **/
			var resolution = {};
			resolution["height"] = window.outerHeight;
			resolution["width"] = window.outerWidth;
			var resolution_json = JSON.stringify(resolution);
			/** Send imageid´s + info to php **/
			$.ajax({
				url: "includes/backend/lightbox.php",
				type: "post",		
				data: "resolution=" + resolution_json + "&images=" + images_json,	
				success: function (response_json){
					var response = jQuery.parseJSON(response_json);
					if(response.status == "error"){
						console.error("error in lightbox.js: " + response.msg);
						var callback = new Array();
						callback["status"] = "error";
						callback["message"] = response.msg;
						callback["url"] = formurl;
						console.log(response);
					}else{
						jQuery.data( document.body, "images", response.images);
						/** load images in cache **/
						console.log(jQuery.data( document.body, "images"));
						var order = [];
						var counter = 0;
						$.each( jQuery.data( document.body, "images"), function( id, info ) {
							$("#lightbox-preload").append("<img src='" + info.src + "'/>");
							order[counter] = id;
							counter++;
						});
						jQuery.data( document.body, "image_order", order);
					}

				},
				error: function (status){
					console.log("error");
				}
			});
		}
		jQuery.data(document.body,"init",true)
	}
    },
	
    show : function(img_id, options){
		console.log("show img with id " + img_id);
	
		console.log(img_id);
		var images = jQuery.data( document.body, "images");
		var order = (jQuery.data( document.body, "image_order")) ? jQuery.data( document.body, "image_order") : [];
		var current_image = "";
		var current_order = 0;
		
		if(jQuery.data(document.body,"init") != true ){
			methods.init(options);
		}
		
		function ResizeImg(current_image){
			var windowWidth;
			var windowHeight;
			var ratio = 0;
			
			if(self.innerHeight){
				windowWidth = self.innerWidth;
				windowHeight = self.innerHeight;
			}else if(document.documentElement && document.documentElement.clientHeight){
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			}else if(document.body){ // other Explorers
				windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight;
			}
			if(windowWidth > 960){
				var maxWidth = 960;
			}else if(windowWidth < 150){
				var maxWidth = 150;
			}else{
				var maxWidth = windowWidth - 150;
			}
			var maxHeight = windowHeight - 50;
			var width = current_image.size.width;
			var height = current_image.size.height;
			if(width > maxWidth){
				ratio = maxWidth / width;
				$("#curr_image").css("width", maxWidth);
				$("#curr_image").css("height", height * ratio);
			}
			if(height > maxHeight){
				ratio = maxHeight / height;
				$("#curr_image").css("height", maxHeight);
				$("#curr_image").css("width", width * ratio);
			}			
		}
	
			var callback = new Array();
			callback["status"] = "";
			callback["message"] = "";
			
			var defaultCallback = function(params){
				// nothing lmfao
			}
			
			var settings = {
				room: true,
				callback: defaultCallback,
				laodimg: false // although it could already be stored temporary
			}
			var opt = $.extend(settings, options);

	
		if( images &&(typeof images[img_id] == "object") && (images[img_id] !== null)){
			current_image = images[img_id];
			console.log("found!");
		}else{
			console.log("look in db...");
			var resolution = {};
			resolution["height"] = window.outerHeight;
			resolution["width"] = window.outerWidth;
			var resolution_json = JSON.stringify(resolution);
			var image = [];
			image[0] = {};
			image[0]["id"] = img_id;
			var images_json = JSON.stringify(image);
			
			$.ajax({
				url: "includes/backend/lightbox.php",
				type: "post",		
				data: "resolution=" + resolution_json + "&images=" + images_json,
				success: function (response_json){
					var response = jQuery.parseJSON(response_json);
					if(response.status == "error"){
						console.log("error in lightbox.js: " + response.msg);
						callback["status"] = "error";
						callback["message"] = response.msg;
						callback["url"] = formurl;
					}else{
						var images = response.images;
						current_image = images[img_id];
						console.log(current_image);
					}
					console.log(response);

					settings.callback(callback);
				},
				error: function (status){
					console.log("error");
					console.log(status);
				}
			});
		}
		console.log("current_order: " + current_order);
		for (var i=0; i<order.length; i++){
			console.log([i] + " : " +order[i]);
			if (order[i] === img_id){
				console.log("found at: " + i + " . Img_id: " + order[i]);
				current_order = i;
			}
		}
		console.log("current_order: " + current_order);
		console.log(current_image);
		
		$("#lightbox-content").html("<img id='curr_image' src='" + current_image.src + "'/>");
		$("#lightbox-content").append("<div id='img_info'><span id='img_name'>" + current_image.name + "</span><span id='img_user_name'><img id='img_user_avatar' src='" + current_image.owner_avatar + "'/>" + current_image.owner + "</span></div>");
		ResizeImg(current_image);
		$( window ).resize(function() {
			ResizeImg(current_image);
		});
		
		/* fadeIn animation */
		if(opt.room == true){
			$("#lightbox-room").delay(100).fadeIn(650);
		}
		$("#lightbox").show("scale",function(){
			callback["status"] = "ok";
			callback["message"] = "box opened";
			settings.callback(callback);
			
			/* setting up interaction */
			var lastaction_time = Date.now();
			$(document).on('keyup', function (event) {
				event.stopImmediatePropagation();
				$(document).unbind('keyup'); // to prevent multiple binding event to object. -> leads to multiple event calling
				/* keys with cooldown */
				if((event.timeStamp - lastaction_time) >= 1200){
					lastaction_time = Date.now(); // resets time
					
					if(event.which == 37){ // previous image (left arrow)
						if(current_order <= 0){ // if previous element is outside of scope
							methods.show(order[order.length - 1], options);
						}else{
							methods.show(order[current_order - 1], options);
						}
					}
					if(event.which == 39){ // next image (right arrow)
						if((parseInt(current_order) + 1) >= (parseInt(order.length) - 1)){ // if next element is outside of scope
							console.log("show first");
							console.log(order[0] + " |current: " + order[current_order]);
							methods.show(order[0], options);
						}else{
							console.log(current_order);
							console.log(order);
							var next = current_order++;
							console.log("current: " + current_order + " [id]:" + order[current_order]);
							console.log("next: " + next + " [id]:" + order[next]);
							methods.show(order[next], options);
						}
					}
				}
				/* keys without cooldown */
				if(event.which == 27){ // close (Esc)
					$("#lightbox-close").trigger("click");
				}
				event.preventDefault();
			});
		}, 1650);
    }
  };

  $.fn.lightbox = function( method ) {
	/* polyfills */
	if (!Date.now) {
		Date.now = function() { return new Date().getTime(); };
	}
	/* function */
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + " does not exist on the lightbox.js" );  
	}
  };

})( jQuery );