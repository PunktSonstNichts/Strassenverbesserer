(function ($) {
    "use strict";
    var ajaxform = false;

    var methods = {
    init : function (options) {

	if(window.initialized != true){
		$('<div id="dialog-helper"><div id="dialog" style="display: none"><div id="close">&times;</div><div id="dialog-content"></div></div></div><div id="inactiv-overlay" style="display: none"></div>').prependTo("body");
		$("#close").click( function(e){
			$("#dialog").slideUp(700, function() {
				$("#dialog").removeClass("success").removeClass("error").removeClass("file");
			});
			$("#inactiv-overlay").fadeOut();
			$("body").css("overflow", "auto");
			e.stopPropagation();
		});
		
		window.initialized = true;
	}
    },
	
    show : function(file, options){
	if(window.initialized != true){
		methods.init();
	}
	
			var callback = new Array();
			callback["status"] = "";
			callback["message"] = "";
			
			var defaultCallback = function(params){
				// nothing lmfao
			}
			
			var settings = {
				agree: ".btn_success",
				close: ".btn_danger",
				areyousure: "#commit",
				inactivbox: true,
				callback: defaultCallback,
				ajaxform: false,
				formname: ".dialog" // if ajaxform = true
            }
            var opt = $.extend(settings, options);
			ajaxform = opt.ajaxform;

	if(opt.inactivbox == true){
		var top = $(window).scrollTop();
		$("#inactiv-overlay").fadeIn().css("margin-top", top);
		$("body").css("overflow", "hidden");
	}
	
       $("#dialog").load(file, function(response, status, xhr){
		if (status == "error") {
			console.error("Da lief etwas schief: " + xhr.status + " " + xhr.statusText + " - (" + file + ")");
			callback["status"] = "error";
			callback["message"] = xhr.statusText;
			settings.callback(callback);
		}else{
		
			if(opt.ajaxform == true){
				$(opt.formname).bind('submit', function(event){
					event.preventDefault();
					
					var data = $(this).serialize();
					var formtype = $(this).attr("method");
					var formurl = $(this).attr("action");
					console.log("submit");
					$.ajax({
						url: formurl,
						type: formtype,		
						data: data,	
						success: function (response){
							console.log(response);
							callback["status"] = "success";
							callback["message"] = response;
							callback["url"] = formurl;
							settings.callback(callback);
						}
					});
		
					event.preventDefault();
				});
			}
			
			$(opt.agree).click( function(e){
				$("#dialog").slideUp().removeClass("success").removeClass("error").removeClass("file");
				$("#inactiv-overlay").fadeOut();
				$("body").css("overflow", "auto");
				e.stopPropagation();
				if(ajaxform == false){
					callback["status"] = "Agreed";
					callback["message"] = "";
					settings.callback(callback);
				}
			});
			$(opt.close).click( function(e){
				$("#dialog").slideUp().removeClass("success").removeClass("error").removeClass("file");
				$("#inactiv-overlay").fadeOut();
				$("body").css("overflow", "auto");
				e.stopPropagation();
				callback["status"] = "Denied";
				callback["message"] = "";
				settings.callback(callback);
			});
		}
		}).fadeIn();
	 
    },
		show_again : function( options ){
		if(window.initialized != true){
			methods.init();
		}
	
		var callback = new Array();
		callback["status"] = "";
		callback["message"] = "";
		
		var defaultCallback = function(params){
			// nothing lmfao
		}
	
		var settings = {
            agree: ".btn_success",
			close: ".btn_danger",
			areyousure: "#commit",
			inactivbox: true,
			callback: defaultCallback,
			ajaxform: false,
			formname: ".dialog" // if ajaxform = true
        }
        var opt = $.extend(settings, options);
		ajaxform = opt.ajaxform;
		
		$("#dialog").fadeIn();
		if(opt.ajaxform == true){
				$(opt.formname).bind('submit', function(event){
					event.preventDefault();
					
					var data = $(this).serialize();
					var formtype = $(this).attr("method");
					var formurl = $(this).attr("action");
	
					$.ajax({
						url: formurl,
						type: formtype,		
						data: data,	
						success: function (response){
							callback["status"] = "success";
							callback["message"] = response;
							settings.callback(callback);
						}
					});
		
					event.preventDefault();
				});
			}
			
			$(opt.agree).click( function(e){
				$("#dialog").slideUp().removeClass("success").removeClass("error").removeClass("file");
				$("#inactiv-overlay").fadeOut();
				$("body").css("overflow", "auto");
				e.stopPropagation();
				if(ajaxform == false){
					callback["status"] = "Agreed";
					callback["message"] = "";
					settings.callback(callback);
				}
			});
			$(opt.close).click( function(e){
				$("#dialog").slideUp().removeClass("success").removeClass("error").removeClass("file");
				$("#inactiv-overlay").fadeOut();
				$("body").css("overflow", "auto");
				e.stopPropagation();
				callback["status"] = "Denied";
				callback["message"] = "";
				settings.callback(callback);
			});
	},
    error : function( content ) {
	if(window.initialized != true){
		methods.init();
	}
      $("#dialog").removeClass("success").addClass("error");
	  $("#dialog-content").html(content);
	  $("#close").html("&times;");
      $("#inactiv-overlay").fadeIn();
	  $("body").css("overflow", "hidden");
	  $("#dialog").fadeIn(); // Fade in if everything is prepared
    },
    success : function( content ) {
	if(window.initialized != true){
		methods.init();
	}
      $("#dialog").removeClass("error").addClass("success").fadeIn().delay(1800).slideUp();
	  $("#dialog-content").html(content);
	  $("#close").html("");
    }
  };

  $.fn.dialog = function( method ) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + " does not exist on the dialog.js" );  
	}
  };

})( jQuery );