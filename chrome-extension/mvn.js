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

console.log("MV Notifier init", "running every 30 sec");

init();

var _num = 0;
var _audio, _fade;
var notifications = {};


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
			_audio.src = "assets/notification.mp3";

	  	localStorage("get", "MVN-user");

	  	window.MV = setInterval(checkNotifications, 30000);
	  }

  //+-------------------------------------------------------
  //| checkNotifications()
  //| + Loads the information from MV every 30 sec
  //| + Loads only when localstorage is ready
  //+-------------------------------------------------------
		function checkNotifications(){

			var xhr = new XMLHttpRequest();
			xhr.open("GET", "http://www.mediavida.com/notificaciones/fly", true);
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.onreadystatechange = function() {
			  if (xhr.readyState == 4) {
			    parseMV(xhr.responseText);
			  }
			}
			xhr.send();
			
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

			//sendPush("test", "Prueba");

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
	  function sendPush(notID, text){

  		_num ++;

	  	var options = {
			  type: "basic",
			  iconUrl: "/assets/mv.png",
			  title: "Mediavida Notifier",
			  message: text,
			  //contextMessage: "testinger",
			  priority: 2
			}

			chrome.notifications.create(notID, options);
			chrome.browserAction.setBadgeText({text: (_num>0)?_num.toString():""});

			_audio.play();
			window.setTimeout(function(){ updatePush(notID); }, 4000);
			window.setTimeout(function(){ clearNotification(notID); }, 12000);
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

	  	_num--;
	  	chrome.browserAction.setBadgeText({text: (_num <0)? _num.toString() : "" });

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

	  	if(!_fade){
		  	_fade = true;
				var vol = 1;
				var interval = 100; // 200ms interval

				var fadeout = setInterval(
				  function() {
				    // Reduce volume by 0.05 as long as it is above 0
				    // This works as long as you start with a multiple of 0.05!
				    if (vol > 0.05) {
				      vol -= 0.05;
				      _audio.volume = vol; console.log(vol);
				    }
				    else {
				      // Stop the setInterval when 0 is reached
				      _fade = false;
				      _audio.pause();
				      _audio.volume = 1;
							_audio.currentTime = 0;
							clearInterval(fadeout);
				    }
				  }, interval);	  		
	  	}

	  }

	  chrome.notifications.onClicked.addListener(pushAction);
	  chrome.notifications.onClosed.addListener(clearNotification);
	  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    	if (request.clear == "0"){ _num = 0; }
  	});

	//+-------------------------------------------------------
  //| localStorage()
  //| + Manages values in storage to know last recorded not.
  //+-------------------------------------------------------
	  function localStorage(method, key, value){
	  	var storage = chrome.storage.local;

	  	if(method == "set"){
	  		var obj= {};
				obj[key] = value;
				storage.set(obj);
	  	}

	  	if(method == "get"){
	  		storage.get(key,function(result){

				});
	  	}
	  }

  //+-------------------------------------------------------
  //| Force https
  //| Detects the protocol and redirects to https
  //+-------------------------------------------------------
  /*
	  chrome.webRequest.onBeforeRequest.addListener(function (details){
	  	protocol = details.url.split("://")[0];
	    if(protocol == "http"){
	    	return {redirectUrl: "https" + details.url.substring(protocol.length)};
	    }    
	  },
	    {urls: ["http://*.mediavida.com/*"], types: ["main_frame"]}, ["blocking"]
	  );
	  */