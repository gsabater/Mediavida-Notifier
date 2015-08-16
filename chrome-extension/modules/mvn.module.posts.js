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

reverseQuote();

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

	//+-------------------------------------------------------
  //| orderbyManitas()
  //| + Loads the whole post and sorts the posts by manitas
  //+-------------------------------------------------------
  	if($(".largecol > .post").length){ $("#scrollpages").append("<em class='mvn-orderby-manita'><img src='/style/img/botones/thumb_up.png' alt='me gusta' width='14' height='14'></em>"); }
  	$(".mvn-orderby-manita").on("click", function(){ orderbyManitas(); });

	  function orderbyManitas(){
	  	var page = false;

	  	//First prepare the visual feedback
	  	$("#main").prepend("<div class='indicator'><span class='spinner'><img src='/style/img/loader.gif' /> Cargando y ordenando posts, espera...</span></div>");
	  	$(".largecol").prepend("<div id='mvn-order-results'></div>");

	  	$("#main").addClass("mvn-loading-all");
	  	$(".post").first().addClass("mvn-first-post");
	  	$("form .post").addClass("mvn-fake-post");

	  	//Get current page already loaded and last page to load
	  	current_page = (_url[4] && _url[4] !== "1" && !isNaN(_url[4]))? parseInt(_url[4]) : 1;
	  	last_page = $(".tpag .paginas .last").text();
	  	console.log("Current pag", current_page, last_page);
	  	
	  	//Start loading everything
	  	if(last_page > 1){
	  		loadPages(1, last_page, current_page);
	  	}else{
	  		console.log("solo una pag xd");
	  		applyOrder();
	  	}
	  }

	  function loadPages(page, last_page, current_page){
	  	var postURL = ($(".headlink").length)? $(".headlink").attr("href") + "/" + page : fullURL + "/" + page;
	  	
	  	if(page == current_page){
	  		page++;
	  		if(page <= last_page){ loadPages(page, last_page, current_page); }else{ applyOrder(); }
	  	}else{

		  	console.log("loading page", page,postURL);

		  	$.ajax({
					url: postURL,
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						//handler("XMLHttpRequest".responseText);
						console.log("error", XMLHttpRequest.responseText);
					},
					success: function(data, textStatus, XMLHttpRequest) {
						//console.log("ok"); //,data
						//handler(data);
						//imagenes(data);

						insertPost(data, page, current_page);
						page++;
		  			if(page <= last_page){ loadPages(page, last_page, current_page); }else{ applyOrder(); }

					}
				});
	  	}
	  }

	  function insertPost(xhr, page, current_page){
	  	
	  	var posts = $('.post', xhr);
	  	var append = (page < current_page)? false : true;
	  	console.log(posts);

	  	for (i = 0; i <= posts.length - 1; i++){
	  		if(posts[i].id){
	  			$(posts[i]).attr("data-likes", $(posts[i]).find(".mola").text());
		  		if(append){
		  			$(posts[i]).insertBefore(".largecol .tpanel");
		  		}else{
		  			$(posts[i]).insertBefore(".mvn-first-post");
		  		}
		  	}
	  	}
	  }

	  function applyOrder(){
	  	console.log("APPLY ORDER");
			var posts = $(".post:not(.mvn-fake-post)");

			for (i = 0; i <= posts.length - 1; i++){
	  		$(posts[i]).attr("data-likes", $(posts[i]).find(".mola").text());
	  	}

			posts.sort(function (a, b){

		    a = parseInt($(a).attr("data-likes"), 10);
		    b = parseInt($(b).attr("data-likes"), 10);

				return ((a < b) ? 1 : ((a > b) ? -1 : 0));
			});

			window.scrollTo(0, 0);
			$("#mvn-order-results").append(posts);
			$(".mvn-loading-all").removeClass("mvn-loading-all");
	  }