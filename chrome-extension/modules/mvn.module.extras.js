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

  //+-------------------------------------------------------
  //| Extra:
  //| + Duplicate pagination on top of page
  //+-------------------------------------------------------
    if(_url[1] == "foro" && $("div.tpag").length){
      $("#togglecats2").closest(".tpanel").addClass("mvn-foro-top-panel");
      $("#togglecats2").css({ "margin": "5px -5px 0px 10px", "float": "right" });
      $(".tpag").clone().addClass("mvn-pagination-clone").appendTo($(".mvn-foro-top-panel"));
      $(".tnext, .tprev").clone().appendTo($(".mvn-foro-top-panel"));
      $(".mvn-foro-top-panel .tnext").css("margin-top", "10px");
      $(".mvn-foro-top-panel .tprev").css("margin-top", "10px");
    }

  //+-------------------------------------------------------
  //| Extra:
  //| + Duplicate tools on bottom of page
  //+-------------------------------------------------------
    function bottomTools(){
      var bottom_tools = $("#userinfo").clone();
      bottom_tools.removeAttr("id").attr("id","mvn-bottom-tools");

      bottom_tools.prepend("<li><a href='/foro/spy'>Spy</a></li><li>|</li>");
      bottom_tools.append("<li><a href='/foro/buscar.php'><i class='fa fa-search'></i></a></li>");
      bottom_tools.find(".logout").remove();

      bottom_tools.insertAfter("#postform");
    }

  //+-------------------------------------------------------
  //| Extra:
  //| + Confirm before leaving a group
  //+-------------------------------------------------------
    $("#grupo .stats .acciones a").on("click", function(e){

      var x;
      var r=confirm("¿Estás seguro de querer hacer esto?");
      if(r===true){ return true;
      }else{
        e.preventDefault();
        return false; }
    });

  //+-------------------------------------------------------
  //| Extra:
  //| + Include font-awesome so we can use it in the project
  //+-------------------------------------------------------
    var styleNode           = document.createElement ("link");
    styleNode.rel           = "stylesheet";
    styleNode.id            = "MVN-FA";
    styleNode.href          = "https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css";

    document.head.appendChild (styleNode);
      
  //+-------------------------------------------------------
  //| Extra:
  //| + Check for dark theme
  //+-------------------------------------------------------
    oscuro = ($("link[href*='oscuro.css']").length)? true : false;
    if(oscuro){ $("body").addClass("MVN-oscuro"); }
    
  //+-------------------------------------------------------
  //| Replace MARK for MVN-MARK
  //+-------------------------------------------------------
    $(".mark").removeClass("mark").addClass("mvn-mark");

  //+-------------------------------------------------------
  //| + Check for usertools installed
  //| + Print init DOM modifications
  //+-------------------------------------------------------
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    //| + Check for UT
    //+-------------------------------------------------------  
      var observer = new MutationObserver(function(mutations, observer){
        //console.log(mutations);
        if(mutations[0].type == "childList"){
          if(mutations[0].addedNodes[1].href == "http://mvusertools.com/"){ 
            UT = true; 
            $("body").addClass("has-ut"); 
          }
        }
      });

      observer.observe($(".f_info > p").get(0), {
        subtree: true,
        childList: true,
        attributes: true
      });

  //+-------------------------------------------------------
  //| Basic extras:
  //| + Footer credit
  //| + init settings
  //+-------------------------------------------------------

    //$(".f_info").append("<p><a href='http://www.mediavida.com/foro/mediavida/mediavida-notifier-chrome-extension-541508'>Mediavida Notifier</a> v." + version + "</p>");
    
  //| + init settings
  //+--------------------------------
  /*
    $("body").append("<div id='mvn-settings'>");
    $("#mvn-settings").load( chrome.extension.getURL("settings.html") );

    $("body").on("click", '.mvn-open-settings', function(){
      $.magnificPopup.open({
        items: { src: '#mvn-settings-mfp' },
        type: 'inline',
        mainClass: 'my-mfp-slide-bottom'
      });
    });
    */