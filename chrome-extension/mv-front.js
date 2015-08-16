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

console.log("MV Notifier active");

init();

var UT = false;
var oscuro = false;
var version = "0.3";

var fullURL = window.location.protocol + "://" + window.location.host + "/" + window.location.pathname;
var _url = window.location.pathname.split( '/' );

//console.log(localStorage['ut-Tags']);

  //+-------------------------------------------------------
  //| init()
  //+--------------------------------
  //| + Also inits localstorage
  //+-------------------------------------------------------
	  function init(){
	  	oscuro = ($("link[href*='oscuro.css']").length)? true : false;
	  	if(oscuro){ $("body").addClass("MVN-oscuro"); }
	  }  


	//+-------------------------------------------------------
  //| Miscellanea
  //| + Check for usertools installed
  //| + Print init DOM modifications
  //+-------------------------------------------------------

  	MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  	//| + Check for UT
  	//+-------------------------------------------------------	
			var observer = new MutationObserver(function(mutations, observer) {
				//console.log(mutations);
				if(mutations[0].type == "childList"){
				  if(mutations[0].addedNodes[1].href == "http://mvusertools.com/"){ 
				  	UT = true; 
				  	$("body").addClass("has-ut"); 
				  }
				}
			});

			observer.observe($(".f_info > p").get(0), {
			  subtree: true,
			  childList: true,
			  attributes: true
			});


