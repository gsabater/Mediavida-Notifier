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

var _user  = [];
var _posts = [];
var _pages = [];

var fullURL = window.location.protocol + "://" + window.location.host + "/" + window.location.pathname;
var _url = window.location.pathname.split( '/' );

//console.log(localStorage['ut-Tags']);

  //+-------------------------------------------------------
  //| init()
  //+--------------------------------
  //| + Checks for dark theme
  //| + Checks if any notification is on the button and append
  //| + Also inits localstorage *
  //+-------------------------------------------------------
	  function init(){
	  	oscuro = ($("link[href*='oscuro.css']").length)? true : false;
	  	if(oscuro){ $("body").addClass("MVN-oscuro"); }

	  	chrome.runtime.sendMessage({mvnBadge: "num"}, function(response) {
			  printFrontNotifications(response.farewell);
			});

			chrome.runtime.sendMessage({getUser: "object"}, function(response) {
			  _user = response.farewell;
			});
	  }  

	//+-------------------------------------------------------
  //| + printFrontNotifications()
  //| + Print number of notifications in the upper bar
  //| + Clear notifications from bar and button on check
  //+-------------------------------------------------------
		function printFrontNotifications(num){
			if(num && parseInt(num) > 0){
				$("#notifylink").prepend("<strong class='bubble'>"+num+"</strong>");	
			}
		}

		$("#notifylink").on("click", function(){
			$(this).find(".bubble").remove();
			chrome.runtime.sendMessage({clear: "0"});
		});

	//+-------------------------------------------------------
  //| + Check for usertools installed
  //| + Print init DOM modifications
  //+-------------------------------------------------------
  	MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  	//| + Check for UT
  	//+-------------------------------------------------------	
			var observer = new MutationObserver(function(mutations, observer){
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


