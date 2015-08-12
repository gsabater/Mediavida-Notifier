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

window.MV = setInterval(checkNotifications, 30000);
initParser();

var local = false;
var localID = 0;
var notifications = {};


  //+-------------------------------------------------------
  //| initParser()
  //| + Creates the first ul element used to parse 
  //| + the response from server
  //+--------------------------------
  //| + Also inits localstorage
  //+-------------------------------------------------------
	  function initParser(){
	  	var ul = document.createElement( 'ul' );
	  	ul.setAttribute("id", "parser");
	  	document.body.appendChild(ul);

	  	localStorage("get", "lastNotification");
	  }

  //+-------------------------------------------------------
  //| checkNotifications()
  //| + Loads the information from MV every 30 sec
  //| + Loads only when localstorage is ready
  //+-------------------------------------------------------
		function checkNotifications(){
			console.log("check", local, localID);
			if(local){
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

			if(local !== last.id){
				for(i=lis.length-1; i>=0; i--){

					var notID = parseInt(lis[i].id.split("f_")[1]);
					if(notID > localID){
						text = lis[i].getElementsByTagName("blockquote")[0].innerText;
						_url = lis[i].getElementsByTagName("a")[0].href;

						localID = notID;
						sendPush(lis[i].id, text);
						notifications[lis[i].id] = {url:_url};
						localStorage("set", "lastNotification", lis[i].id);
					}
				}

			}else{
				//console.log("No updates",last.id);
			}
			
	  }

	//+-------------------------------------------------------
  //| sendPush()
  //| + Sends a notification to the browser with details
  //+-------------------------------------------------------
	  function sendPush(notID, text){
	  	var options = {
			  type: "basic",
			  title: "Mediavida Notifier",
			  message: text,
			  iconUrl: "48.png"
			}
			chrome.notifications.create(notID, options);
	  }

	//+-------------------------------------------------------
  //| pushAction()
  //| + Opens link and deletes notification from center
  //+-------------------------------------------------------
	  function pushAction(notificationId){
	  	var base = chrome.extension.getURL("");
	  	var url = "http://www.mediavida.com/"+notifications[notificationId].url.split(base)[1];
	  	chrome.tabs.create({"url":url,"selected":true});
	  	chrome.notifications.clear(notificationId);
	  }

	  chrome.notifications.onClicked.addListener(pushAction);

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

				local = value; //ugly fix
	  	}

	  	if(method == "get"){
	  		storage.get(key,function(result){
	  			console.log("Get local",result,result.lastNotification);
	  			if(!result.lastNotification){ local = 1; localStorage("set", "lastNotification", "f_1"); }else{ local = result.lastNotification; localID = parseInt(result.lastNotification.split("f_")[1]);  }
				});
	  	}
	  }