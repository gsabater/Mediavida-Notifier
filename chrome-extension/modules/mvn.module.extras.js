//=================================================================
//
//  ███╗   ███╗███████╗██████╗ ██╗ █████╗ ██╗   ██╗██╗██████╗  █████╗ 
//  ████╗ ████║██╔════╝██╔══██╗██║██╔══██╗██║   ██║██║██╔══██╗██╔══██╗
//  ██╔████╔██║█████╗  ██║  ██║██║███████║██║   ██║██║██║  ██║███████║
//  ██║╚██╔╝██║██╔══╝  ██║  ██║██║██╔══██║╚██╗ ██╔╝██║██║  ██║██╔══██║
//  ██║ ╚═╝ ██║███████╗██████╔╝██║██║  ██║ ╚████╔╝ ██║██████╔╝██║  ██║
//  ╚═╝     ╚═╝╚══════╝╚═════╝ ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═════╝ ╚═╝  ╚═╝                                                               
//   
//=================================================================

  //+-------------------------------------------------------
  //| Extra:
  //| + Duplicate pagination on top of page
  //+-------------------------------------------------------
  	if(_url[1] == "foro" && $("div.tpag").length){
  		$("#togglecats2").closest(".tpanel").addClass("mvn-foro-top-panel");
  		$("#togglecats2").css({ "margin": "5px -5px 0px 10px", "float": "right" });
  		$(".tpag").clone().addClass("mvn-pagination-clone").appendTo($(".mvn-foro-top-panel"));
  		$(".tnext, .tprev").clone().appendTo($(".mvn-foro-top-panel"));
  		$(".mvn-foro-top-panel .tnext").css("margin-top", "10px");
  		$(".mvn-foro-top-panel .tprev").css("margin-top", "10px");
  	}

  //+-------------------------------------------------------
  //| Extra:
  //| + Confirm before leaving a group
  //+-------------------------------------------------------
  $("#grupo .stats .acciones a").on("click", function(e){

    var x;
    var r=confirm("¿Seguro que quieres salir del grupo y no la estás liando porque vas con prisas?");
    if(r===true){
      return true;
    }else{
      e.preventDefault();
      return false;
    }

  });

      
    

  //+-------------------------------------------------------
  //| Basic extras:
  //| + Footer credit
  //| + init settings
  //+-------------------------------------------------------

	  //$(".f_info").append("<p><a href='http://www.mediavida.com/foro/mediavida/mediavida-notifier-chrome-extension-541508'>Mediavida Notifier</a> v." + version + "</p>");
	  
	//| + init settings
  //+--------------------------------
  /*
	  $("body").append("<div id='mvn-settings'>");
	  $("#mvn-settings").load( chrome.extension.getURL("settings.html") );

	  $("body").on("click", '.mvn-open-settings', function(){
	  	$.magnificPopup.open({
			  items: { src: '#mvn-settings-mfp' },
			  type: 'inline',
				mainClass: 'my-mfp-slide-bottom'
			});
	  });
    */