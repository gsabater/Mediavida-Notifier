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

checkNotifications();

chrome.runtime.sendMessage({clear: "0"});

  //+-------------------------------------------------------
  //| checkNotifications()
  //| + Loads the information from MV every 30 sec
  //| + Loads only when localstorage is ready
  //+-------------------------------------------------------
    function checkNotifications(){

      console.log("get notificaciones");

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

      var base = chrome.extension.getURL("");

      for(i=lis.length-1; i>=0; i--){

        _url = lis[i].getElementsByTagName("a")[0]
        url = "http://www.mediavida.com/" + _url.href.split(base)[1];

        _url.href = url;
        _url.target = "_blank";

      }

    }    