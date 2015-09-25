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
  //| + Checks if any notification is on the button and append
  //| + Also inits localstorage *
  //+-------------------------------------------------------
	  function init(){

	  	chrome.runtime.sendMessage({mvnBadge: "num"}, function(response) {
			  printFrontNotifications(response.farewell);
			});

			chrome.runtime.sendMessage({getUser: "object"}, function(response) {
			  _user = response.farewell;
			  doMVN();
			});
	  }  

  //+-------------------------------------------------------
  //| doMVN()
  //+--------------------------------
  //| + inits MVN functions according to _user settings.
  //+-------------------------------------------------------
	  function doMVN(){

	  	applyFont();
	  	initPostTools();
	  	forumBookmarks();

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

