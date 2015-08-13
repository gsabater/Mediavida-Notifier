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
chrome.browserAction.setBadgeText({text:""});

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

      console.log("print notificaciones");

      var el = document.getElementById('parser');
      el.innerHTML = xhr;    

      //hacer que la ultima notificación sea la last en local  
    }    