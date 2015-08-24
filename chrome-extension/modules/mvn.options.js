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
$(function(ready){

  console.log("MV Notifier Options page");
  user = { };

  window.setTimeout(function(){ chrome.storage.local.get("MVN-user", function(result){ initSettings(result); });  }, 100);
  
  //+-------------------------------------------------------
  //| + Capture changes on the settings page and save it
  //+-------------------------------------------------------
    $("input, select").change(function(){

      options = {
        https: $("#option-https").is(":checked"),
        audio: ($("#option-notif-audio").is(":checked"))? $("#notification-audio").val() : false
      };

      chrome.runtime.sendMessage({options: options});
      saved();
    });

    function saved(){
      $(".saved").fadeIn(300);
      window.setTimeout(function(){$(".saved").fadeOut(300);}, 1000);
    }

  //+-------------------------------------------------------
  //| + Run the notification test for the current settings
  //+-------------------------------------------------------
    $(".js-test-notification").on("click", function(){
      chrome.runtime.sendMessage({test: "true"});
    });

  //+-------------------------------------------------------
  //| initSettings()
  //| + Sets the notifications into the options page
  //+-------------------------------------------------------
    function initSettings(options){
      user = options['MVN-user'];

      if(user.https){ $("#option-https").attr("checked", "checked"); }
      if(user.audio){ 
        $("#option-notif-audio").attr("checked", "checked");
        $("#notification-audio").val(user.audio);
      }

    }
});