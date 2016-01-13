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
// At post load, call initPostTools, which creates an array with
// all the posts on of the page. After that, detects the current thread
// page and adds some flags to some not useful elements.
// Calls userTools(); embedMedia(); reverseQuote();
//=================================================================

var _scroll       = 1,      // int of the current page in screen
    _first        = 0;      // int of the first loaded page

var in_post       = false,  // true or false depending if the page is a post
    current_page  = 1,      // int of the current loaded xhr page number
    last_page     = 1,      // int of the last thread page
    loadingPage   = false;  // loading boolean flag to control ajax

var _op           = false;  // name of the post OP
var thread_url    = ($(".headlink").length)? $(".headlink").attr("href") : window.location.pathname;
    thread_url    = window.location.protocol + "//" + window.location.host + thread_url;
    thread_url    = (thread_url.slice(-2) == "/1")? thread_url.substr(0, thread_url.length -2) : thread_url;



  //+-------------------------------------------------------
  //| initPostTools()
  //| + Gets an array of the posts on the page to 
  //| + attach and process the information
  //| usage: $(_posts['93']).css("color","red");
  //+-------------------------------------------------------
    function initPostTools(){

      //for each post update the _posts object
      var posts = $(".largecol .post:not(.mvn-post)");
      for (i = 0; i <= posts.length - 1; i++){
        _posts[posts[i].id.substring(4)] = posts[i];
        $("#post"+posts[i].id.substring(4)).addClass("mvn-post");
      }

      //Get current page already loaded and last page to load
      current_page = (_url[4] && _url[4] !== "1" && !isNaN(_url[4]))? parseInt(_url[4]) : 1;
      last_page = $(".tpag .paginas .last").text();
      in_post = ($(".largecol > .post").length)? true : false;
      if(in_post){ in_post = ($("body#live").length)? false : true; }
      _scroll = _first = current_page;
      _pages[current_page] = true;

      //Add flag to .post div that is a fake post
      $("form .post").addClass("mvn-fake-post");
      console.log("Loaded post: ", in_post, "- Current page: " + current_page, "- Last page: " + last_page);

      //Add flag to hidden posts that can be shown for not hide
      $(".hiddenmsg").closest(".nopost").addClass("mvn-showpost");

      //Add flag to pagination items
      $("#scrollpages em").addClass("mvn-page-active");
      $("#scrollpages > a:not(.togglefav), #scrollpages > em").each(function(i,e){
        $(e).addClass("mvn-post-page").attr("data-mvnpage", $(e).text()); });

      // Add infinite scroll toggler
      if(in_post && last_page){
        _disabledScroll = (!_user.scroll)? "mvn-infinite-disabled":"";
        $("#scrollpages").append("<em class='mvn-toggle-infiniteScroll" + _disabledScroll + "' alt='Toggle infinite Scroll' title='Toggle infinite Scroll' ><i class='fa fa-sort-amount-desc' style='font-size: 15px;'></i></em>"); }

      //Add orderby button
      if(in_post){ 
        $("#scrollpages").append("<em class='mvn-orderby-manita' alt='Ordenar por manitas' title='Ordenar por manitas'><i class='fa fa-thumbs-o-up' style='font-size: 15px;'></i></em>"); }     
      
      //Hide deleted posts if user wants
      if(_user.hideNopost){ $("body").addClass("mvn-hide-nopost"); }      
      
      //Add bottom tools only once per post
      if(in_post){ bottomTools(); }

      //init postTools
      postTools();

      //Create placeholder to avoid js error
      $.fn.tipsy = function(){ console.log("placeholder"); }

    }

    function postTools(){
      userTools();
      reverseQuote();

      if(_user.flagOp){       getOP(); }
      if(_user.makeGallery){  betterLigtbox(); }
      if(_user.media.detect){ embedMedia(); }
    }

  //+-------------------------------------------------------
  //| Toggle infinite scroll with option
  //+-------------------------------------------------------
    $("body").on("click", ".mvn-toggle-infiniteScroll", function(e){
      $(this).toggleClass("mvn-infinite-disabled");
      _user.scroll = !_user.scroll;
    });

  //+-------------------------------------------------------
  //| Infinite scroll
  //| + Loads next page if any.
  //+-------------------------------------------------------
    $(window).scroll(function(){
      //console.log("Loaded post: " + in_post, "- Current page: " + current_page, "- Last page: " + last_page, fullURL, _url);
      //console.log($(window).scrollTop(), $(document).height(), $(document).height()-200);

      if(_user.scroll && in_post){
        
        if(($(window).scrollTop() >= ($(document).height() - $(window).height() - 800)) && (current_page < last_page)){
          loadPage(); }

        if($('.mvn-ajax-pagination').length){

          _pagination = [0];
          var scrollPos = $(document).scrollTop();

          // build for a list of pages
          $('.mvn-ajax-pagination').each(function(i,e){
            _pagination[(i+1)] = $(e).position().top; //$(e).attr("data-mvnpage")
          });

          // for every page, check position
          for(i in _pagination){

            if((scrollPos+100) >= _pagination[i]){
                _scroll = _first + parseInt(i); //console.log("set "+_scroll,i);

              if(_pagination[i+1]){
                if(scrollPos+100 < _pagination[i+1]){
                  //_scroll = parseInt(i)+3; //console.log("_set "+_scroll,i);
                }
              }
            }
          }

          // Update history status
          window.history.replaceState("", "", thread_url + "/" + _scroll);

          // Update page status in sidebar
          // and create pages not available
          $(".mvn-page-active").addClass("mvn-page-not-active");
          if(!$(".mvn-post-page[data-mvnpage='" + _scroll + "'").length){
            prev = $(".mvn-post-page[data-mvnpage='" + (_scroll-1) + "'");
            _new = prev.clone();
            _new.attr({"href":"javascript:void(0);", "data-mvnpage": _scroll});
            _new.text(_scroll).insertAfter(prev);
          }

          // Set active in current page
          $(".mvn-post-page[data-mvnpage='" + _scroll + "'").addClass("mvn-page-active").removeClass("mvn-page-not-active");
          if($("em.mvn-post-page").length){
            em = $("em.mvn-post-page");
            em.replaceWith( '<a href="'+ window.location.href +'" class="'+em.attr("class")+'" data-mvnpage="'+em.attr("data-mvnpage")+'">'+em.text()+'</a>' );
          }

        }

      }

      if($(window).scrollTop() >= 200){ $("body").addClass("mvn-bookmarks-fixed"); }else{ $("body").removeClass("mvn-bookmarks-fixed"); }

    });


  //+-------------------------------------------------------
  //| loadPage
  //| + Loads a specific page given a parameter
  //+-------------------------------------------------------
    function loadPage(page, callback){
    
      if($("#postform").is(":visible")){ loadingPage = true; }
      if(!loadingPage){
        
        loadingPage = true;
        if(in_post){

          page = (page)? page : current_page + 1;

          if(callback){ found = false;
            for(i = last_page; i >= 1; i--){ //console.log(i, _pages[i]); 
              if(!_pages[i]){ 
                page = i; found = true; 
                $(".status-page").text("Página " + page + "/" + last_page); 
              } 
            } 

            if(!found){ return applyOrder(); }
          }

          $.ajax({
            url: thread_url + "/" + page,

            error: function(XMLHttpRequest, textStatus, errorThrown) {
              //handler("XMLHttpRequest".responseText);
              console.log("error", XMLHttpRequest.responseText);
            },

            success: function(data, textStatus, XMLHttpRequest) {
              
              loadingPage = false;
              _pages[page] = true;

              if(callback=="manitas"){
                insertXHR(data, true);
                loadPage(false,"manitas");
              }
              if(callback=="op"){
                extractOP(data);
              }
              if(!callback){
                insertXHR(data);
                if(page == (current_page+1)){ current_page++; }
              }

            }

          });

        }
      }
    }   


  //+-------------------------------------------------------
  //| insertXHR
  //| + Inserts the loaded posts in DOM
  //+-------------------------------------------------------
    function insertXHR(xhr, withoutPagination){
      var posts = $('.post', xhr);

      if(!withoutPagination){
        $("#bottompanel").replaceWith($("#bottompanel", xhr));

        var bottom = $("#bottompanel", xhr).clone();
        bottom.removeAttr("id").addClass("mvn-ajax-pagination");
        bottom.attr("data-mvnpage", bottom.find(".paginas em").text());
        
        bottom.find(".tprev, .tnext, .paginas a, .paginas span").remove();
        bottom.find(".paginas em").prepend("Página ").css("background-color", "transparent");
        bottom.insertBefore("#bottompanel");
        //$(".mvn-ajax-pagination .paginas a").each(function(i,e){ $(e).replaceWith("<span>"+$(e).text()+"</span>"); });
      }
      
      for (i = 0; i <= posts.length - 1; i++){
        if(posts[i].id && !$(posts[i]).hasClass("postit")){
          _posts[posts[i].id.substring(4)] = posts[i];
          $(posts[i]).attr("data-likes", $(posts[i]).find(".mola").text()).addClass("mvn-post mvn-ajax");
          if(!withoutPagination){ $(posts[i]).insertBefore("#bottompanel"); }
        }
      }

      if(!withoutPagination){
        postTools();
      }

    }


  //+-------------------------------------------------------
  //| getOP()
  //| + Flags OP if _op is available
  //| else calls for extraction
  //+-------------------------------------------------------
    function getOP(){

      if(_op){ 
        $(".post").each(function(i,e){
          poster = $(e).find(".autor dl dt a").text();
          if(poster == _op){ $(e).addClass("mvn-thread-op"); }
        });
        return true;
      }
      
      extractOP();
    }

  //+-------------------------------------------------------
  //| extractOP()
  //| + Parse html to get op name, loads page 1 if needed.
  //+-------------------------------------------------------
    function extractOP(xhr){

      if($("#post1").length){
        var post = $('#post1');
      }else{
        if(xhr){ var post = $('#post1', xhr); }
        else{
          // Load page #1 if needed
          loadPage(1, "op");
          return false;
        }
      }

      _op = post.find(".autor dl dt a").text();
      getOP();
    }    

  //+-------------------------------------------------------
  //| reverseQuote()
  //| + Parses the current posts 
  //| + and shows quote information on each footer
  //+-------------------------------------------------------
    function reverseQuote(){

      var mentions = [];
      var mentors = [];

    //| + Find quotes in every post
    //+-------------------------------------------------------
      for(i in _posts){
        var quotes = $(_posts[i]).find(".cuerpo").find("a.quote").get();
        //console.log(i, quotes.length, quotes);

        for(q in quotes){
          //console.log(quotes[q]);
          quote = quotes[q];
          if(quote.rel){
            if(!mentions[quote.rel]){ mentions[quote.rel] = []; }
            if(mentions[quote.rel].indexOf(_posts[i].id.substring(4)) < 0){
              mentions[quote.rel].push( _posts[i].id.substring(4) );  
            }
          }
        }

        mentors[_posts[i].id.substring(4)] = $(_posts[i]).find(".autor dt").text();
      }

      //console.log(mentions, mentors);


    //| + Print quotes in posts
    //+-------------------------------------------------------
      $(".mvn-mention").remove();
      for(key in mentions){

        var m = [];

        for(i in mentions[key]){
          m[i] = mentors[mentions[key][i]] + " <a href='#"+mentions[key][i]+"' rel='"+mentions[key][i]+"' class='quote'>#" +mentions[key][i] + "</a>";
        }

        $("#post"+key).find(".bwrap").append("<span class='mvn-mention'>Citado por " + m.join(", ") + "</span>");
      }

    }
    

  //+-------------------------------------------------------
  //| orderbyManitas()
  //| + Loads the whole post and sorts the posts by manitas
  //+-------------------------------------------------------
    $("body").on("click", ".mvn-orderby-manita", function(e){ 

      if($(this).hasClass("MVN-reset-post")){ location.reload(); return false; }
      
      $(this).addClass("MVN-reset-post");
      $(this).find("i").removeClass("fa-thumbs-o-up").addClass("fa-undo");

      $(".mvn-post-page, .mvn-toggle-infiniteScroll").css({"opacity":"0.2", "cursor":"default"});

      orderbyManitas();
      
    });

    function orderbyManitas(){
      console.log("+ MVN: orderbyManitas()");

      //First prepare the visual feedback
      $("#main").addClass("mvn-loading-all");
      $("#main").prepend("<div class='indicator'><span class='spinner'>Cargando y ordenando posts, espera...</span><span class='status-page'></span></div>");
      $(".largecol").prepend("<div id='mvn-order-results'></div>");     

      //Start loading everything
      loadPage(false,"manitas");

    }

    function applyOrder(){
      console.log("APPLY ORDER");
    }

  //+-------------------------------------------------------
  //| applyOrder()
  //| + Orders array and removes visual feedback
  //+-------------------------------------------------------    
    function applyOrder(){
      console.log("APPLY ORDER");

      var _order = [];

      for(key in _posts){
        likes = $(_posts[key]).find(".mola").text();
        $(_posts[key]).attr("data-likes", likes);
        if(likes > 1){ _order[key] = _posts[key]; }
      }

      console.log(_posts, _order);

      _order.sort(function (a, b){

        a = parseInt($(a).attr("data-likes"), 10);
        b = parseInt($(b).attr("data-likes"), 10);

        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
      });

      window.scrollTo(0, 0);
      $(".largecol .post:not(.mvn-fake-post)").remove();
      $("#mvn-order-results").append(_order);
      $(".mvn-loading-all").removeClass("mvn-loading-all");

      postTools();
    }

  //+-------------------------------------------------------
  //| Post action: Click #num to quote - init dom
  //+-------------------------------------------------------
    $(".info a.qn").on("click", function(){
      $("#postform").show();
    });

  //+-------------------------------------------------------
  //| Post action: Click #num to quote - ajax listener
  //+-------------------------------------------------------
    $("body").on("click", "#quickreply, .info a.qn", function(e){
      
      if($(this).hasClass("qn")){ 

        var cursorPos = $("#cuerpo").prop('selectionStart'),
        v = $("#cuerpo").val(),
        textBefore = v.substring(0,  cursorPos ),
        textAfter  = v.substring( cursorPos, v.length ),
        quoteNum = "#" + $(this).attr("rel") + " ";
        $('#cuerpo').val( textBefore + quoteNum + textAfter );

      }

      $("#postform").show();
      $("html, body").animate({ scrollTop: $(document).height() }, "slow", function(){
        $("#cuerpo").focus();
      });

      e.preventDefault();
      return false;
    });

  //+-------------------------------------------------------
  //| Post action: Click to vote - ajax listener
  //+-------------------------------------------------------
    $("body").on("click", ".mvn-post .masmola", function(e){
      var m = $(this).closest(".mvn-post").find(".mola");

      var data = { 
        token: $("#token").val(),
        tid: $("#tid").val(),
        num: $(this).attr("rel")
      };

      $.post("/foro/post_mola.php", data).done(function( data ){
        if(data == "-1"){ alert("Ya has votado este post");  }
        if(data == "-2"){ alert("No puedes votar más posts hoy"); }
        if(data == "-3"){ alert("Regístrate para botar posts"); }
        if(data == "-4"){ alert("No puedes votar este post"); }
        if(data == "1"){ 
          n = parseInt(m.text()) + 1;
          m.text(n);
          m.fadeIn();
        }
      });

      e.preventDefault();
      return false;
    });

  //+-------------------------------------------------------
  //| Post action: Click to see upvotes
  //+-------------------------------------------------------
    $("body").on("click", ".mvn-ajax a.mola", function(e){

      $.get( $(this).attr("href") , function( data ){
        $.magnificPopup.open({
          items: { src: '<div id="mvn-settings-mfp" class="zoom-anim-dialog mvn-manitas">'+data+'</div>' },
          type: 'inline',
          mainClass: 'my-mfp-slide-bottom'
        });
      });

      e.preventDefault();
      return false;
    });

  //+-------------------------------------------------------
  //| Live post action: click to quote and post
  //+-------------------------------------------------------
    $("#liveposts").on("click", ".info a", function(e){

        var cursorPos = $("#cuerpo").prop('selectionStart'),
        v = $("#cuerpo").val(),
        textBefore = v.substring(0,  cursorPos ),
        textAfter  = v.substring( cursorPos, v.length ),
        quoteNum = $(this).attr("href") + " ";
        
        $('#cuerpo').val( textBefore + quoteNum + textAfter );

      $("#postform").show();
      $("html, body").animate({ scrollTop: 0 }, "slow", function(){
        $("#cuerpo").focus();
      });

      e.preventDefault();
      return false;
    }); 

  //+-------------------------------------------------------
  //| initPostTools()
  //| + Gets an array of the posts on the page to 
  //| + attach and process the information
  //| - $(_posts['93']).css("color","red");
  //+-------------------------------------------------------
    function applyFont(){

      $("#MVN-font-family, #MVN-font-style").remove();

      if(_user.font.family !== "Verdana"){
        var styleNode           = document.createElement ("link");
        styleNode.rel           = "stylesheet";
        styleNode.type          = "text/css";
        styleNode.id            = "MVN-font-family";
        styleNode.href          = "https://fonts.googleapis.com/css?family="+ _user.font.family.replace(" ", "+") +":400,300,600,700";
        document.head.appendChild (styleNode);
      }

      /* 
      Fail xDD
      var d = new Date();
      if((d.getDate() == 28)&&(d.getMonth() == 10)){
        _user.font.family = "Comic Sans MS";
        _user.font.size = "15px";
        _user.font.line = "19px";
        $( "<style id='MVN-font-style-inocente'>div.post .msg .body .cuerpo{ color: #D6596F; }.MVN-oscuro div.post .msg .body .cuerpo{ color: pink; }</style>" ).appendTo("head");        
      }
      */

      var newFont = (_user.font.family == "Verdana")? "Verdana','Geneva','sans-serif" : _user.font.family;

      $( "<style id='MVN-font-style'>div.post .msg .body .cuerpo{ " +
          "font-family: '"+ newFont +"' !important;"+
          "font-size: "+ _user.font.size +" !important;"+
          "line-height: "+ _user.font.line +" !important;"+
          "letter-spacing: "+ _user.font.letter +" !important;"+
          "}</style>"
      ).appendTo("head");

    }