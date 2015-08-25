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
  //| + Each element with data-option attribute is passed
  //| + to the options object in mvn.js
  //+-------------------------------------------------------
    $("input, select").change(function(){

      options = {
        audio : ($("#option-notif-audio").is(":checked"))? $("#notification-audio").val() : false
      };

      $("[data-option]").each(function(i, el){
        options[$(el).attr('data-option')] = $(el).is(":checked");
      });

      console.log(options);

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

      for(option in user){
        if((user[option] == true)&&($("input[data-option='"+option+"']").length > 0)){ 
          $("input[data-option='"+option+"']").attr("checked", "checked");
        }
      }

      if(user.audio){ 
        $("#option-notif-audio").attr("checked", "checked");
        $("#notification-audio").val(user.audio);
      }

    }
});