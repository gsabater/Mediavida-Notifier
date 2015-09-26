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

  chrome.runtime.sendMessage({getUser: "object"}, function(response) {
    initSettings(response.farewell);
  }); 

  //+-------------------------------------------------------
  //| + Capture changes on the settings page and save it
  //| + Each element with data-option attribute is passed
  //| + to the options object in mvn.js
  //+-------------------------------------------------------
    $("input, select").change(function(){ saveOptions(); });

    function saveOptions(){

      // Start object with audio
      options = {
        audio : ($("#option-notif-audio").is(":checked"))? $("#notification-audio").val() : false
      };

      //For every option, insert itself in object
      $("[data-option]").each(function(i, el){
        options[$(el).attr('data-option')] = $(el).is(":checked");
      });

      // Gather the font object
      options['font'] = {
        family: $("select[data-font='family']").val(),
        size: $("select[data-font='size']").val(),
        letter: $("select[data-font='letter']").val(),
        line: $("select[data-font='line']").val()
      };

      // Gather the media
      options['media'] = {
        detect: $("input[data-media='detect']").is(":checked"),
        hover: $("input[data-media='hover']").is(":checked"),
        magnific: $("input[data-media='magnific']").is(":checked"),
        magnificMV: $("input[data-media='magnificMV']").is(":checked"),
        autoembed: $("input[data-media='autoembed']").is(":checked")
      };      

      console.log(options);

      // Feedback
      saved();
      previewFont(options.font);
      chrome.runtime.sendMessage({options: options}); 
    }

    function saved(){
      $(".saved").fadeIn(300);
      window.setTimeout(function(){$(".saved").fadeOut(300);}, 700);
    }

  //+-------------------------------------------------------
  //| + Run the notification test for the current settings
  //+-------------------------------------------------------
    $(".js-test-notification").on("click", function(){
      chrome.runtime.sendMessage({test: "true"});
    });

  //+-------------------------------------------------------
  //| + Reset the font values
  //+-------------------------------------------------------
    $(".js-reset-font").on("click", function(){

      var font = {};

      font.family   = "Verdana";
      font.size     = "12px";
      font.letter   = "0";
      font.line     = "18px";

      $("select[data-font='family']").val(font.family);
      $("select[data-font='size']").val(font.size);
      $("select[data-font='letter']").val(font.letter);
      $("select[data-font='line']").val(font.line);

      saveOptions();
    });

  //+-------------------------------------------------------
  //| initSettings()
  //| + Sets the notifications into the options page
  //+-------------------------------------------------------
    function initSettings(options){

      user = options;
      console.log(options);

      for(option in user){
        if((user[option] == true)&&($("input[data-option='"+option+"']").length > 0)){ 
          $("input[data-option='"+option+"']").attr("checked", "checked");
        }
      }

      if(user.audio){ 
        $("#option-notif-audio").attr("checked", "checked");
        $("#notification-audio").val(user.audio);
      }

      /*
      if(!user.notifications){
        $("input[data-option='notifications']")
        .closest(".card")
        .animate({height: 58}, 'slow', function(){ 
          $(this).css("overflow", "hidden"); 
        });
      }
      */

      if(user.media.detect){     $("input[data-media='detect']").attr("checked", "checked"); }
      if(user.media.hover){      $("input[data-media='hover']").attr("checked", "checked"); }
      if(user.media.magnific){   $("input[data-media='magnific']").attr("checked", "checked"); }
      if(user.media.magnificMV){   $("input[data-media='magnificMV']").attr("checked", "checked"); }
      if(user.media.autoembed){  $("input[data-media='autoembed']").attr("checked", "checked"); }

      $("select[data-font='family']").val(user.font.family);
      $("select[data-font='size']").val(user.font.size);
      $("select[data-font='letter']").val(user.font.letter);
      $("select[data-font='line']").val(user.font.line);
      previewFont(user.font);

      $(".version").text(user.v);
    }

  //+-------------------------------------------------------
  //| Font options()
  //| + Sets settings for text styles on posts
  //+-------------------------------------------------------    
    function previewFont(font){
      //console.log(font);

      $("#MVN-font-family, #MVN-font-style").remove();

      if(font.family !== "Verdana"){
        var styleNode           = document.createElement ("link");
        styleNode.rel           = "stylesheet";
        styleNode.type          = "text/css";
        styleNode.id            = "MVN-font-family";
        styleNode.href          = "https://fonts.googleapis.com/css?family="+ font.family.replace(" ", "+") +":400,300,600,700";
        document.head.appendChild (styleNode);
      }

      $( "<style id='MVN-font-style'>.font-preview p{ " +
          "font-family: '"+ font.family +"' !important;"+
          "font-size: "+ font.size +" !important;"+
          "line-height: "+ font.line +" !important;"+
          "letter-spacing: "+ font.letter +" !important;"+
          "}</style>"
      ).appendTo("head");
    }

  //+-------------------------------------------------------
  //| + Menu Tabs
  //+-------------------------------------------------------
    $(".menu span").on("click", function(){
      
      var index = $(this).index();

      $("#container h1, .card").hide();
      $("[data-item="+ index +"]").show();

      $(".menu span.active").removeClass("active");
      $(this).addClass("active");

    });

});

//<link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700' rel='stylesheet' type='text/css'>