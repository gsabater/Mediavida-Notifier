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
//  to cancel lightbox in a family of elements, use .mvn-lightbox-canceled
//=================================================================
  
  var items = [];

  var iconIMG     = "<i class='fa fa-picture-o mvn-ico-embed'></i>";
  var iconYTB     = "<i class='fa fa-youtube-play mvn-ico-embed'></i>";
  var iconMP3     = "<i class='fa fa-volume-up mvn-ico-embed'></i>";
  var iconVINE    = "<i class='fa fa-vine mvn-ico-embed'></i>";
  var iconINST    = "<i class='fa fa-instagram mvn-ico-embed'></i>";
  var iconVIDEO   = "<i class='fa fa-video-camera mvn-ico-embed'></i>";
  var iconCHROME  = "<i class='fa fa-chrome mvn-ico-embed'></i>";
  var iconLOADING = "<i class='fa fa-circle-o-notch fa-spin mvn-ico-embed'></i>";

  var iconERROR   = "<i class='fa fa-ban mvn-ico-embed'></i>";


  var embedIMG    = "<img src='placeholder' class='mvn-embed' />";
  var embedYTB    = "<div class='embedded'><div class='youtube_lite'><a href='javascript:void(0)' data-youtube='placeholder' data-width='620' data-height='349' data-init='false' style=\"background-image:thumbnailholder\"><span class='play'></span></a></div></div>";
  var embedMP3    = "<br><audio controls><source src='placeholder' type='audio/mpeg'></audio><br>";
  var embedMP3_   = "<audio controls autoplay=''><source src='placeholder' type='audio/mpeg'></audio>";
  var embedVINE   = "<iframe src='placeholder' width='480' height='480' frameborder='0' class='mvn-embed-vine'></iframe><script src='https://platform.vine.co/static/scripts/embed.js'></script>";
  var embedINST   = '<br><iframe allowtransparency="true" frameborder="0" height="533" scrolling="no" src="placeholder" width="459"></iframe>';
  var embedGIFV   = '<video autoplay="" loop="" muted=""><source type="video/webm" src="placeholder"></video>';
  var embedGIFV_  = '<video autoplay="" loop="" controls><source type="video/webm" src="placeholder"></video>';

  //+-------------------------------------------------------
  // Notes:
  // .mvn-lightbox is applied as a flag for element processed
  // and also fires the magnific popup element.
  // ---
  // .mvn-embeded is applied to already processed embed media
  // ---
  // .mvn-tooltip & .tooltip-effect-1 are applied for elements
  // that have preview on hover
  // ---
  // .mvn-embed-highlight is just a CSS alias for the effect
  // applied to the .mvn-tooltip elements
  //+-------------------------------------------------------


  //+-------------------------------------------------------
  //| embedMedia()
  //| + Try to autoembed image links and youtube links into 
  //| + posts with a hover tooltip
  //+-------------------------------------------------------
    function embedMedia(){


    //+-------------------------------------------------------
    //| + Plain images
    //+-------------------------------------------------------
      var mediaIMG    = $('.post .msg a[href*=".gif"]:not(.mvn-embeded), .post .msg a[href*=".jpg"]:not(.mvn-embeded), .post .msg a[href*=".png"]:not(.mvn-embeded)');
      mediaIMG.each(function(i,e){

        if($(e).attr("href").indexOf(".gifv") > -1){ return true; } //do not track gifv from imgur.
        if(($(e).children().length == 0)&&($(e).text().substring(0,10) == $(e).attr("href").substring(0,10))){
          
          $(e).addClass("mvn-embeded mvn-tooltip tooltip-effect-1 mvn-embed-image").removeAttr("title");
          $(e).closest(".post").addClass("mvn-overflow-visible");
          
          $(e).append( iconIMG );
          //$(e).attr("data-magnific", "image");
          $(e).addClass("mvn-lightbox-canceled");

          media = embedIMG.replace("placeholder",$(e).attr("href"));
          if(_user.media.hover){ $(e).append('<span class="tooltip-content">'+ media +'</span>'); }
        }
      });


    //+-------------------------------------------------------
    //| + Imgur
    //+-------------------------------------------------------
      var mediaIMGUR  = $('.post .msg a[href*="imgur.com"]:not(.mvn-embeded)');   
      mediaIMGUR.each(function(i,e){

        if($(e).find("img").length){ return true; }
        if($(e).attr("href").indexOf("/gallery/") > -1){ return true; } //do not track albums.
        if($(e).attr("href").indexOf("/a/") > -1){ return true; } //do not track galleries.

        $(e).addClass("mvn-embeded mvn-tooltip tooltip-effect-1 mvn-embed-imgur").removeAttr("title");
        $(e).closest(".post").addClass("mvn-overflow-visible");

        imgURL = $(e).attr("href").split("/");
        imgURL = imgURL[imgURL.length -1];

        if((imgURL.indexOf(".jpg") > -1)||
           (imgURL.indexOf(".png") > -1)||
           ((imgURL.indexOf(".gif") > -1)&&(imgURL.indexOf(".gifv") == -1))){

          media = embedIMG.replace("placeholder", "http://i.imgur.com/"+imgURL);
          
          $(e).append( iconIMG );
          //$(e).attr("data-magnific", "imgur-img").attr("data-magnificsrc", "http://i.imgur.com/"+imgURL);
          $(e).addClass("mvn-lightbox-canceled");
          
          if(_user.media.hover){ $(e).append('<span class="tooltip-content">'+ media +'</span>'); }

        }else{

          imgurID = (imgURL.indexOf(".") > -1)? imgURL.split(".")[0] : imgURL ;
          $(e).append( iconLOADING );

          $.ajax({
            url: "https://api.imgur.com/3/image/"+imgurID,
            beforeSend: function(xhr){ xhr.setRequestHeader ("Authorization", "Client-ID bc9b5d3961e99d2"); }
          }).done(function( data ){
            
            //console.log(data.data);
            
            $(e).find("i").remove();
            $(e).append( (data.data.gifv)? iconVIDEO : iconIMG );

            media = (data.data.gifv)? embedGIFV.replace("placeholder", 'http://i.imgur.com/'+data.data.id+'.webm') : embedIMG.replace("placeholder", data.data.link);
            if(_user.media.hover){ $(e).append('<span class="tooltip-content">'+ media +'</span>'); }

            if(data.data.gifv){ $(e).attr("data-magnific", "gifv").attr("data-magnificsrc", 'http://i.imgur.com/'+data.data.id+'.webm');
            }else{ 
              //$(e).attr("data-magnific", "imgur-img").attr("data-magnificsrc", data.data.link);
              $(e).addClass("mvn-lightbox-canceled");
            }

          })
          .fail(function() {
            $(e).find("i").remove();
            $(e).append( iconERROR );
            $(e).removeClass("mvn-tooltip tooltip-effect-1");
            $(e).addClass("mvn-embed-removed");
          }); 

        }

      });


    //+-------------------------------------------------------
    //| + Videos MP4 & webm
    //+-------------------------------------------------------
      var mediaVIDEO  = $('.post .msg a[href*=".mp4"]:not(.mvn-embeded), .post .msg a[href*=".webm"]:not(.mvn-embeded)');
      mediaVIDEO.each(function(i,e){

        $(e).addClass("mvn-embeded mvn-tooltip tooltip-effect-1").removeAttr("title");
        $(e).closest(".post").addClass("mvn-overflow-visible");

        media = embedGIFV.replace("placeholder",$(e).attr("href"));
        $(e).append( iconVIDEO );
        
        if(_user.media.hover){ $(e).append('<span class="tooltip-content">'+ media +'</span>'); }
        $(e).attr("data-magnific", "gifv").attr("data-magnificsrc", $(e).attr("href"));

      });


    //+-------------------------------------------------------
    //| + Videos Youtube
    //+-------------------------------------------------------
      var mediaYTB    = $('.post .msg a[href*="://youtu.be"]:not(.mvn-embeded)');
      mediaYTB.each(function(i,e){

        $(e).addClass("mvn-embeded");
        $(e).append( iconYTB ).addClass("mvn-embed-highlight");

        ytbURL = $(e).attr("href").split("/");
        ytbURL = ytbURL[ytbURL.length -1];
        media = embedYTB.replace("placeholder", ytbURL).replace("thumbnailholder", "url('https://i.ytimg.com/vi/"+ytbURL+"/hqdefault.jpg')");
        
        if(_user.media.autoembed){ $( media ).insertBefore( e ); }else{
        if(_user.media.hover){ 
          $(e).addClass("mvn-tooltip tooltip-effect-1").append('<span class="tooltip-content"><img src="'+ location.protocol +'//img.youtube.com/vi/'+ytbURL+'/mqdefault.jpg" /></span>'); 
          $(e).closest(".post").addClass("mvn-overflow-visible");
        }}

        $(e).attr("data-magnific", "youtube").attr("data-magnificsrc", ytbURL );

      });

      mediaYTB = $('.post .msg a[href*="://youtube.com"]:not(.mvn-embeded), .post .msg a[href*="://www.youtube.com"]:not(.mvn-embeded)');
      mediaYTB.each(function(i,e){

        if($(e).attr("href").indexOf("/user") > -1){ return true; } //do not track user profiles.
        if($(e).attr("href").indexOf("playlist?") > -1){ return true; } //do not track playlists.
        if($(e).attr("href").indexOf("/channel/") > -1){ return true; } //do not track channels.

        $(e).addClass("mvn-embeded");
        $(e).append( iconYTB ).addClass("mvn-embed-highlight");

        ytbURL = $(e).attr("href").split("v=");
        ytbURL = ytbURL[ytbURL.length -1].split("&");
        ytbURL = ytbURL[0];

        media = embedYTB.replace("placeholder", ytbURL).replace("thumbnailholder", "url('https://i.ytimg.com/vi/"+ytbURL+"/hqdefault.jpg')");
        $(e).attr("data-magnific", "youtube").attr("data-magnificsrc", ytbURL );

        if(_user.media.autoembed){ $( media ).insertBefore( e ); }else{ 
        if(_user.media.hover){ 
          $(e).addClass("mvn-tooltip tooltip-effect-1").append('<span class="tooltip-content"><img src="'+ location.protocol +'//img.youtube.com/vi/'+ytbURL+'/mqdefault.jpg" /></span>'); 
          $(e).closest(".post").addClass("mvn-overflow-visible");
        }}
        

      });   


    //+-------------------------------------------------------
    //| + Vine
    //+-------------------------------------------------------
      var mediaVINE = $('.post .msg a[href*="//vine.co"]:not(.mvn-embeded)');
      mediaVINE.each(function(i,e){

        $(e).addClass("mvn-embeded mvn-embed-highlight").removeAttr("title");
        $(e).append( iconVINE );

        vineURL = $(e).attr("href").replace("/embed","").split("/");
        vineURL = vineURL[vineURL.length -1];
        media = embedVINE.replace("placeholder", "https://vine.co/v/"+vineURL+"/embed/simple");

        if(_user.media.autoembed){ $( media ).insertBefore( e ); }
        $(e).attr("data-magnific", "iframe").attr("data-magnificsrc", "https://vine.co/v/"+vineURL+"/embed/simple" );

      });


    //+-------------------------------------------------------
    //| + INSTAGRAM
    //+-------------------------------------------------------
      var mediaINST   = $('.post .msg a[href*="instagram.com"]:not(.mvn-embeded)');   
      mediaINST.each(function(i,e){

        if($(e).find("img").length){ return true; }
        if($(e).attr("href").indexOf("/p/") === -1){ return true; } //do not track profiles.

        $(e).addClass("mvn-embeded mvn-embed-highlight").removeAttr("title");
        $(e).append( iconINST );

        imgURL = $(e).attr("href").split("/");
        imgURL = (imgURL[imgURL.length -1].length > 1)? imgURL[imgURL.length -1] : imgURL[imgURL.length -2];
        media = embedINST.replace("placeholder", "//instagram.com/p/" + imgURL + "/embed/");

        if(_user.media.autoembed){ $( media ).insertBefore( e ); }
        $(e).attr("data-magnific", "iframe").attr("data-magnificsrc", "//instagram.com/p/" + imgURL + "/embed/" );

      });


    //+-------------------------------------------------------
    //| + MP3 AUDIO
    //+-------------------------------------------------------
      var mediaMP3    = $('.post .msg a[href*=".mp3"]:not(.mvn-embeded)');
      mediaMP3.each(function(i,e){

        $(e).addClass("mvn-embeded mvn-embed-highlight").removeAttr("title");
        $(e).append( iconMP3 );

        media = embedMP3.replace("placeholder",$(e).attr("href"));
        if(_user.media.autoembed){ $( media ).insertBefore( e ); }

        $(e).attr("data-magnific", "audio").attr("data-magnificsrc", $(e).attr("href") );
        
      });


    //+-------------------------------------------------------
    //| + Mediavida intern links
    //+-------------------------------------------------------
      if(_user.media.magnificMV){
        var mediaMV     = $('.post .msg a[href*="mediavida.com"]:not(.mvn-embeded)');
        mediaMV.each(function(i,e){

          $(e).addClass("mvn-embeded mvn-embed-highlight").removeAttr("title");
          $(e).append( iconCHROME );

          var URL = $(e).attr("href").replace("http://","//").replace("https://","//");
          lastChar = URL.slice(-1);
          URL = ((lastChar == ".")||(lastChar == ",")||(lastChar == ")"))? URL.slice(0,URL.length-1) : URL;

          $(e).attr("data-magnific", "mediavida").attr("data-magnificsrc", location.protocol + URL );
          
        });
      } 

    //+-------------------------------------------------------
    //| + Extern iframe links intern links
    //+-------------------------------------------------------
      var mediaIFRAME = $('.post .msg a[href*="humblebundle.com"]:not(.mvn-embeded)');
      mediaIFRAME.each(function(i,e){

        $(e).addClass("mvn-embeded mvn-embed-highlight").removeAttr("title");
        
        // Append icons
        if($(e).attr("href").indexOf("humblebundle.com") > -1){ $(e).append( "<img src='"+chrome.extension.getURL("assets/icon-humble.png")+"' class='mvn-ico-embed' style='margin-left: 5px;' />" ); }
        //if($(e).attr("href").indexOf("steamcommunity.com") > -1){     $(e).append( "<img src='"+chrome.extension.getURL("assets/icon-humble.png")+"' class='mvn-ico-embed' style='margin-left: 5px;' />" ); }

        var URL = $(e).attr("href");
        lastChar = URL.slice(-1);
        URL = ((lastChar == ".")||(lastChar == ",")||(lastChar == ")"))? URL.slice(0, URL.length-1) : URL;

        $(e).attr("data-magnific", "iframe").attr("data-magnificsrc", URL );
        
      });    

    }


    $("body").on("click", "a.mvn-embeded", function(e){
      if(_user.media.magnific){ 
/*
        if($(this).data("magnific") == "image"){ console.warn("image", $(this).attr("href"));
          $.magnificPopup.open({
            items: { src: $(this).attr("href") },
            type: 'image' }); }

        if($(this).data("magnific") == "imgur-img"){ console.warn("imgur-img", $(this).attr("data-magnificsrc") );
          $.magnificPopup.open({
            items: { src: $(this).attr("data-magnificsrc") },
            type: 'image' }); } 

        if($(this).data("magnific") == "gifv"){ console.warn("gifv", $(this).attr("data-magnificsrc") );
          $.magnificPopup.open({
            items: {
            src: embedGIFV_.replace("placeholder", $(this).attr("data-magnificsrc")),
            type: 'inline' }   }); }      

        if($(this).data("magnific") == "youtube"){ console.warn("youtube", $(this).attr("data-magnificsrc") );
          $.magnificPopup.open({
            items: { src: "http://www.youtube.com/watch?v="+$(this).attr("data-magnificsrc") },
            type: 'iframe' }); }  
*/
        if($(this).data("magnific") == "iframe"){ //console.warn("iframe", $(this).attr("data-magnificsrc") );
          $.magnificPopup.open({
            items: { src: $(this).attr("data-magnificsrc") },
            type: 'iframe',
            mainClass: 'mvn-magnific-iframe' }); }  
/*
        if($(this).data("magnific") == "audio"){ console.warn("audio", $(this).attr("data-magnificsrc") );
          $.magnificPopup.open({
            items: {
            src: embedMP3_.replace("placeholder", $(this).attr("data-magnificsrc")),
            type: 'inline' }   }); }
*/
        if($(this).data("magnific") == "mediavida"){ console.warn("mediavida", $(this).attr("data-magnificsrc") );
          $.magnificPopup.open({
            items: { src: $(this).attr("data-magnificsrc") },
            type: 'iframe',
            mainClass: 'mvn-magnific-iframe' }); }


        e.preventDefault();
        return false;
      }
    });


  //+-------------------------------------------------------
  //| betterLigtbox()
  //| + Replaces choppy fancybox for magnific popup.
  //+-------------------------------------------------------
    function betterLigtbox(){

      //console.log(items, items.length);
      var i = items.length;

      // Remove <a for every image, to avoid default lightbox
      //$(".post a[onclick='return false;']").each(function(i,e){
      //  $(e).contents().unwrap();
      //});

      // Add lightbox class to every image and add it to items
      // also include embeded items, to help create a full gallery
      $(".mvn-embeded[data-magnific]:not(.mvn-lightbox):not(.mvn-embed-removed):not(.mvn-lightbox-canceled), "+
        //.post img.lazy:not(.mvn-lightbox):not(.mvn-lightbox-canceled), "+
        "a[data-youtube]:not(.mvn-lightbox):not(.mvn-lightbox-canceled):not(.mvn-lightbox-canceled), "+
        "iframe.vine-embed:not(.mvn-lightbox):not(.mvn-lightbox-canceled)").each(function(i,e){

        // do not add elements inside a link
        var parent = $(e).parent().get(0);
        if(parent.tagName == "A"){ $(e).addClass("mvn-lightbox-canceled"); return true; }
        
        // Add lightbox, which is a flag to not process again, and also
        // the magnific initiator
        var anchor = items.length;
        $(e).addClass("mvn-lightbox").attr("data-mgf", anchor);


        //| 1. Include images
        //+-------------------------------------------------------        
          if($(e).hasClass("lazy") && !$(e).hasClass("mvn-embeded")){ items.push({src: $(e).attr("src"), anchor: anchor }); return true; }


        //| 2. Include youtube embeds
        //+-------------------------------------------------------
          if($(e).data("youtube")){ items.push({src: "http://www.youtube.com/watch?v="+$(e).data("youtube"), type: 'iframe', anchor: anchor }); return true; }
        

        //| 3. Include vines
        //+-------------------------------------------------------
          if($(e).hasClass("vine-embed")){ items.push({src: "<iframe src='"+ $(e).attr("src") +"' width='600' height='600' frameborder='0' class='mvn-embed-vine'></iframe>", type: 'inline', anchor: anchor }); return true; } 
        

        //| 3. Include already processed media, excluding iframe and Mediavida
        //| Also remove imgur media not processed (its included via async ajax)
        //+-------------------------------------------------------
        if($(e).data("magnific") == "iframe"){    $(e).removeClass("mvn-lightbox"); return true; }
        if($(e).data("magnific") == "mediavida"){ $(e).removeClass("mvn-lightbox"); return true; }

        if(($(e).data("magnific") == "imgur-img") &&(!$(e).attr("data-magnificsrc"))){ $(e).removeClass("mvn-lightbox"); return true; }
        if(($(e).data("magnific") == "gifv")      &&(!$(e).attr("data-magnificsrc"))){ $(e).removeClass("mvn-lightbox"); return true; }

        if($(e).data("magnific") == "image"){      items.push({src: $(e).attr("href"), anchor: anchor }); }
        if($(e).data("magnific") == "imgur-img"){  items.push({src: $(e).attr("data-magnificsrc"), anchor: anchor }); }
        if($(e).data("magnific") == "gifv"){       items.push({src: embedGIFV_.replace("placeholder", $(e).attr("data-magnificsrc")), type: 'inline', anchor: anchor }); }
        if($(e).data("magnific") == "youtube"){    items.push({src: "http://www.youtube.com/watch?v="+$(e).attr("data-magnificsrc"), type: 'iframe', anchor: anchor }); }
        if($(e).data("magnific") == "audio"){      items.push({src: embedMP3_.replace("placeholder", $(e).attr("data-magnificsrc")), type: 'inline', anchor: anchor }); }

      });
      
      // Update magnific if has not changed in the loop
      var magnificPopup = $.magnificPopup.instance;
      if(magnificPopup.items){ }//magnificPopup.updateItemHTML(); }

        
      // cyclic insertion to update missing or freshly added pages
      window.setTimeout(function(){
        betterLigtbox();
      }, 2500);

    }

  //+-------------------------------------------------------
  //| Initialize magnific
  //+-------------------------------------------------------
    $("body").on("click", ".mvn-lightbox", function(){

      $.magnificPopup.open({
        items: items,
        type: 'image', // this is default type
        verticalFit: false, // Fits image in area vertically
        gallery: {
          enabled: true,
          preload: [0,1] // Will preload 0 - before current, and 1 after the current image
        },
        callbacks: { 
          //elementParse: function(item){ item.src = item.el[0].src; },
          change: function(){
            $item = $("[data-mgf='"+this.currItem.data.anchor+"']");

            // Show spoilers and the whole post if hidden for moderation or spoiler.
            if(!$item.closest("div").is(":visible")){ $item.closest("div").show(); }
            if(!$item.closest(".post").is(":visible")){ $item.closest(".post").show(); }

            // Now that we know its position, scroll the window to it
            if($item.offset()){
              $('html, body').animate({ scrollTop: $item.offset().top - 200 }, 150);  }
          }
        }
      }, parseInt($(this).attr("data-mgf")));

    }); 
