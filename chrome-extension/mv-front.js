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

console.log("MV Notifier active");

init();

var UT     = false;
var oscuro = false;

var _user  = [];
var _posts = [];
var _pages = [];
var _mvnLS = [];

var fullURL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname;
var _url    = window.location.pathname.split( '/' );


//+-------------------------------------------------------
//| init()
//+--------------------------------
//| + Adds badge from back notifications count num
//| + Init localstorage
//+-------------------------------------------------------
function init()
{

    chrome.runtime.sendMessage({mvnBadge: "num"}, function(response) {
        printFrontNotifications(response.farewell);
    });

    chrome.runtime.sendMessage({getUser: "full"}, function(response) {
        console.log("localStorage from background", response);

        if(response){
            _user = response.user;
            _mvnLS = response.ls;
            doMVN();
        }else{
            console.log("localStorage not available, retrying...");
            init();
        }
    });

}


//+-------------------------------------------------------
//| doMVN()
//+-------------------------------------------------------
//| + inits MVN functionalities
//+-------------------------------------------------------
function doMVN()
{

    //redactor();             // mvn.module.posts.redactor
    //applyFont();            // mvn.module.posts
    //initPostTools();        // mvn.module.posts


    //fixHotlink();           // mvn.module.posts.hotlink
    //forumBookmarks();

}



//+-------------------------------------------------------
//| + printFrontNotifications()
//| + Print number of notifications in the upper bar
//| + Clear notifications from bar and button on check
//+-------------------------------------------------------
function printFrontNotifications(num)
{
    if(num && parseInt(num) > 0){
        $("#notifylink").prepend("<strong class='bubble'>"+num+"</strong>");
    }
}

$("a.flink[title='Notificaciones']").on("click", function(){
    //$(this).find(".bubble").remove();
    chrome.runtime.sendMessage({clear: "0"});
});
