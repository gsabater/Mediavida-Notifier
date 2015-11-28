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
var _mvnLS = [];

var fullURL = window.location.protocol + "://" + window.location.host + "/" + window.location.pathname;
var _url = window.location.pathname.split( '/' );

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

			chrome.runtime.sendMessage({getUser: "full"}, function(response) {
				//console.log("localStorage from background", response);
			  _user = response.user;
			  _mvnLS = response.ls;
				
				doMVN();
				//checkLocalStorage();
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
	  	//forumBookmarks();

	  }

	//+-------------------------------------------------------
  //| + checkLocalStorage()
  //| + Print number of notifications in the upper bar
  //| + Clear notifications from bar and button on check
  //+-------------------------------------------------------
		function checkLocalStorage(){

			if(localStorage['ut-Tags'] && 
				(localStorage['ut-Tags'] !== "[]") &&
				(!_mvnLS.tags['mvn-set'])){

				_mvnLS.tags = JSON.parse(localStorage['ut-Tags']); _mvnLS.tags['mvn-set'] = true;
				console.warn(_mvnLS, _mvnLS.tags, localStorage['ut-Tags']);

				chrome.runtime.sendMessage({mvnLS: _mvnLS});
			}

			if(localStorage['ut-forosFav'] && 
				(localStorage['ut-forosFav'] !== "[]") &&
				(!_mvnLS.forums.length)){

				_mvnLS.forums = JSON.parse(localStorage['ut-forosFav']);
				console.warn(_mvnLS, _mvnLS.forums, localStorage['ut-forosFav']);

				chrome.runtime.sendMessage({mvnLS: _mvnLS});
			}

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

