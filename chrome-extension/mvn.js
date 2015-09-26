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
// Modules:
// mvn posts: 	Reverse quote, orderByManitas
// mvn user: 		userTools
// mvn extras: 	Settings injection and upper pagination
//=================================================================
// opcion no hace reverse

console.log("MV Notifier background");

var v = 0.81;

var _audio;
var _num = 0;
var notifications = { };

var ls = { };
var user = {
	notifications	: true,
	onlyGroups		: false,
	audio					: "notification_1up.mp3",

	hideNopost 		: true,

	https					: false,
	scroll				: true,

	media: {
		detect: true,
		hover: true,
		magnific: true,
		autoembed: true
	},

	font: {
		family: "Verdana",
		letter: 0,
		line:   "18px",
		size:   "12px"
	}

};


init();


  //+-------------------------------------------------------
  //| init()
  //| + Creates the first ul element used to parse 
  //| + the response from server
  //+--------------------------------
  //| + Also inits localstorage
  //+-------------------------------------------------------
	  function init(){
	  	var ul = document.createElement( 'ul' );
	  	ul.setAttribute("id", "parser");
	  	document.body.appendChild(ul);

	  	_audio = new Audio();
	  	_audio.src = "assets/" + user.audio;

	  	window.MV = setInterval(checkNotifications, 30000);
	  	window.setTimeout(function(){ chrome.storage.local.get("MVN-user", function(result){ MVNStorage(result); });  }, 100);
	  }


  //+-------------------------------------------------------
  //| MVNStorage()
  //| + Loads the information from MV every 30 sec
  //+-------------------------------------------------------
		function MVNStorage(localstorage){

			if(localstorage['MVN-user']){
				for(option in localstorage['MVN-user']){
					user[option] = localstorage['MVN-user'][option]; }
					_audio.src = "assets/" + user.audio;
			}

			if(!localstorage['MVN-user'] || (localstorage['MVN-user'].v < v)){ 
				setMVNStorage(user);
				notifications['update'] = {url: chrome.extension.getURL("") + 'foro/mediavida/mediavida-notifier-chrome-extension-541508'};
				sendPush("update", "Mediavida Notifier ha sido actualizada a la versión "+v, true); 
			}

			console.log(user);
		}

		function setMVNStorage(ls, options){
			if(options){
				for(i in ls){ user[i] = ls[i]; }
			}

			user.v = v;
			var obj = {};
			obj['MVN-user'] = user;

			chrome.storage.local.set(obj);
			if(user.audio){ _audio.src = "assets/" + user.audio; }

			console.log("Setting", obj);
		}


  //+-------------------------------------------------------
  //| checkNotifications()
  //| + Loads the information from MV every 30 sec
  //+-------------------------------------------------------
		function checkNotifications(){

			if(user.notifications){

				var xhr = new XMLHttpRequest();
				xhr.open("GET", "http://www.mediavida.com/notificaciones/fly", true);
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				xhr.onreadystatechange = function() {
				  if (xhr.readyState == 4) {
				    parseMV(xhr.responseText);
				  }
				}
				xhr.send();

			}else{
				console.log("not checking");
			}

		}


  //+-------------------------------------------------------
  //| parseMV()
  //| + Parses the notifications from xhr into the DOM
  //+-------------------------------------------------------
	  function parseMV(xhr){
	  	var el = document.getElementById('parser');
			el.innerHTML = xhr;

			var lis = el.getElementsByTagName('li');
			var last = lis[0];

			//sendPush("test", "Prueba", true);

			for(i=lis.length-1; i>=0; i--){

				if(lis[i].classList.contains("unread")){
					text = lis[i].getElementsByTagName("blockquote")[0].innerText;
					_url = lis[i].getElementsByTagName("a")[0].href;

					sendPush(lis[i].id, text);
					notifications[lis[i].id] = {url:_url};
				}
			}
	  }


	//+-------------------------------------------------------
  //| sendPush()
  //| + Sends a notification to the browser with details
  //+-------------------------------------------------------
	  function sendPush(notID, text, badge){

  		if(!badge){ _num++; }

	  	var options = {
			  type: "basic",
			  iconUrl: "/assets/MVN_128x128.png",
			  title: "Mediavida Notifier",
			  message: text,
			  //contextMessage: "testinger",
			  priority: 2
			}

			chrome.notifications.create(notID, options);
			if(!badge){ chrome.browserAction.setBadgeText({text: (_num>0)?_num.toString():""}); }

			if(user.audio){ _audio.play(); }
			window.setTimeout(function(){ updatePush(notID); }, 4000);
			window.setTimeout(function(){ clearNotification(notID); }, 10000);
	  }


	//+-------------------------------------------------------
  //| updatePush()
  //| + Updates the options so the update lasts longer
  //+-------------------------------------------------------
	  function updatePush(notID){
	  	var options = { contextMessage: "..." }
			chrome.notifications.update(notID, options);
	  }


	//+-------------------------------------------------------
  //| pushAction()
  //| + Opens link and deletes notification from center
  //+-------------------------------------------------------
	  function pushAction(notificationId){

	  	clearNotification(notificationId);

	  	if(_num > 0){ _num--; }
	  	chrome.browserAction.setBadgeText({text: (_num > 0)? _num.toString() : "" });

	  	var base = chrome.extension.getURL("");
	  	var url = "http://www.mediavida.com/"+notifications[notificationId].url.split(base)[1];
	  	chrome.tabs.create({"url":url,"selected":true});
	  }


	//+-------------------------------------------------------
  //| clearNotification()
  //| + Removes the notification from the action center and 
  //| + fades the audio background.
  //+-------------------------------------------------------
	  function clearNotification(notificationId){
	  	chrome.notifications.clear(notificationId);
	  }


  //| + Multiple event listeners for chrome runtime
  //+-------------------------------------------------------
	  chrome.notifications.onClicked.addListener(pushAction);
	  chrome.notifications.onClosed.addListener(clearNotification);
	  
	  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	  	console.log("+ MVN: Message event", request);

			if (request.options)						{ setMVNStorage(request.options, true); }
    	if (request.clear == "0")				{ _num = 0; chrome.browserAction.setBadgeText({text:""}); }
    	if (request.test == "true")			{ sendPush(Math.floor((Math.random() * 100) + 1).toString(), "Prueba de notificación", true); }
    	if (request.mvnBadge == "num")	{ sendResponse({farewell: _num}); }
    	if (request.getUser == "object"){ sendResponse({farewell: user}); }
  	});


  //+-------------------------------------------------------
  //| Force https
  //| Detects the protocol and redirects to https
  //+-------------------------------------------------------
	  chrome.webRequest.onBeforeRequest.addListener(function (details){
	  	if(user.https){
		  	protocol = details.url.split("://")[0];
		    if(protocol == "http"){
		    	return {redirectUrl: "https" + details.url.substring(protocol.length)};
		    }
		  }
	  },
	    {urls: ["http://*.mediavida.com/*"], types: ["main_frame"]}, ["blocking"]
	  );
