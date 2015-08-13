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
reverseQuote();

var oscuro = false;

  //+-------------------------------------------------------
  //| init()
  //+--------------------------------
  //| + Also inits localstorage
  //+-------------------------------------------------------
	  function init(){
	  	oscuro = ($("link[href*='oscuro.css']").length)? true : false;
	  	if(oscuro){ $("body").addClass("MVN-oscuro"); }
	  }  

	//+-------------------------------------------------------
  //| checkNotifications()
  //| + Loads the information from MV every 30 sec
  //| + Loads only when localstorage is ready
  //+-------------------------------------------------------
	  function reverseQuote(){
	  	var mentions = [];
	  	var mentors = [];

	  //| + Find quotes in every post
  	//+-------------------------------------------------------
	  	var posts = $(".largecol > .post");

	  	for (i = 0; i <= posts.length - 1; i++){

	  		var quotes = $(posts[i]).find("a.quote");
	  		if(quotes.length){

		  		for(q = 0; q <= quotes.length - 1; q++){
		  			//console.log("Post "+i, posts[i].id, quotes[q].rel);
		  			if(mentions[quotes[q].rel]){
							mentions[quotes[q].rel].push(posts[i].id.substring(4));
		  			}else{
							mentions[quotes[q].rel] = [posts[i].id.substring(4)];
		  			}

		  			mentors[posts[i].id.substring(4)] = $("#post"+posts[i].id.substring(4)).find(".autor dt a").text();
		  		}
	  		}
	  	};
			
			//console.log(mentions, mentors);

	  //| + Print quotes in posts
  	//+-------------------------------------------------------	  	
	  	for(key in mentions){
	  		if(mentions[key].length > 1){ 
	  			
	  			var m = [];

	  			for (var i = mentions[key].length - 1; i >= 0; i--) {
	  				m[i] = mentors[mentions[key][i]] + " <a href='#"+mentions[key][i]+"' rel='"+mentions[key][i]+"' class='quote'>#" +mentions[key][i] + "</a>";
	  			};

	  			$("#post"+key).find(".bwrap").append("Citado por " + m.join(" - "));

	  		}else{
					$("#post"+key).find(".bwrap").append("Citado por " + mentors[mentions[key]] + " <a href='#"+mentions[key]+"' rel='"+mentions[key]+"' class='quote'>#" +mentions[key] + "</a>");
	  		}
	  		
	  	}

	  	//console.log(mentions);
	  }