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

var in_post = false,
		current_page = 1,
		last_page = 1,
		loadingPage = false;

processPosts();

$.fn.tipsy = function() {
  console.log("placeholder");
};

	//+-------------------------------------------------------
  //| processPosts()
  //| + Gets an array of the posts on the page to 
  //| + attach and process the information
  //| - $(_posts['93']).css("color","red");
  //+-------------------------------------------------------
  	function processPosts(){
  		var posts = $(".largecol .post:not(.mvn-post)");
  		for (i = 0; i <= posts.length - 1; i++){
  			_posts[posts[i].id.substring(4)] = posts[i];
  			$("#post"+posts[i].id.substring(4)).addClass("mvn-post");
  		}

	  	//Get current page already loaded and last page to load
	  	current_page = (_url[4] && _url[4] !== "1" && !isNaN(_url[4]))? parseInt(_url[4]) : 1;
	  	last_page = $(".tpag .paginas .last").text();
	  	in_post = ($(".largecol > .post").length)? true : false;
	  	console.log("Loaded post: ",in_post, "- Current page: " + current_page, "- Last page: " + last_page);

  		reverseQuote();
  		userTools();
  	}


	//+-------------------------------------------------------
	//| Infinite scroll
	//| + Loads next page if any.
	//+-------------------------------------------------------
		$(window).scroll(function(){
			//console.log("Loaded post: " + in_post, "- Current page: " + current_page, "- Last page: " + last_page);
			//console.log($(window).scrollTop(), $(document).height(), $(document).height()-200);

			if(in_post && (current_page < last_page)){
				if($(window).scrollTop() >= ($(document).height() - $(window).height() - 800)){
					loadPage();
				}
			}

		});


	//+-------------------------------------------------------
	//| loadPage
	//| + Loads a specific page given a parameter
	//+-------------------------------------------------------
	  function loadPage(page){
	  
	  	if($("#postform").is(":visible")){ loadingPage = true; }
	  	if(!loadingPage){
	  		
	  		loadingPage = true;
	  		if(in_post){

	  			page = (page)? page : current_page+1;
	  			var postURL = ($(".headlink").length)? $(".headlink").attr("href") + "/" + page : window.location.pathname + "/" + page;

	  			$.ajax({
						url: postURL,

						error: function(XMLHttpRequest, textStatus, errorThrown) {
							//handler("XMLHttpRequest".responseText);
							console.log("error", XMLHttpRequest.responseText);
						},

						success: function(data, textStatus, XMLHttpRequest) {
							insertXHR(data);
							loadingPage = false;
							if(page == (current_page+1)){ current_page++; }
						}

					});

	  		}
	  	}
	  }		


	//+-------------------------------------------------------
	//| insertXHR
	//| + Inserts the loaded posts in DOM
	//+-------------------------------------------------------
	  function insertXHR(xhr){
	  	var posts = $('.post', xhr);

	  	var bottom = $("#bottompanel", xhr).clone().removeAttr("id").addClass("mvn-ajax-pagination").insertBefore("#bottompanel");
	  	//$(".mvn-ajax-pagination .paginas a").each(function(i,e){ $(e).replaceWith("<span>"+$(e).text()+"</span>"); });

	  	$("#bottompanel").replaceWith($("#bottompanel", xhr));

	  	for (i = 0; i <= posts.length - 1; i++){
	  		if(posts[i].id && !$(posts[i]).hasClass("postit")){
	  			_posts[posts[i].id.substring(4)] = posts[i];
	  			$(posts[i]).attr("data-likes", $(posts[i]).find(".mola").text()).addClass("mvn-post mvn-ajax");
		  		$(posts[i]).insertBefore("#bottompanel");//.insertBefore(".largecol .tpanel");
		  	}
	  	}

	  	reverseQuote();
  		userTools();

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
	  	for (i = 0; i <= _posts.length - 1; i++){

	  		var quotes = $(_posts[i]).find("a.quote");
	  		if(quotes.length){

		  		for(q = 0; q <= quotes.length - 1; q++){

		  			if(mentions[quotes[q].rel]){
							mentions[quotes[q].rel].push(_posts[i].id.substring(4));
		  			}else{
							mentions[quotes[q].rel] = [_posts[i].id.substring(4)];
		  			}

		  			mentors[_posts[i].id.substring(4)] = $("#post"+_posts[i].id.substring(4)).find(".autor dt a").text();
		  		}
	  		}
	  	}

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
  	if(in_post){ $("#scrollpages").append("<em class='mvn-orderby-manita'><img src='/style/img/botones/thumb_up.png' alt='Ordenar por manitas' width='14' height='14'></em>"); }
  	$(".mvn-orderby-manita").on("click", function(){ orderbyManitas(); });

/*
	//+-------------------------------------------------------
  //| orderbyManitas()
  //| + Loads the whole post and sorts the posts by manitas
  //+-------------------------------------------------------
  	if($(".largecol > .post").length){ $("#scrollpages").append("<em class='mvn-orderby-manita'><img src='/style/img/botones/thumb_up.png' alt='me gusta' width='14' height='14'></em>"); }
  	$(".mvn-orderby-manita").on("click", function(){ orderbyManitas(); });

	  function orderbyManitas(){

	  	console.log("+ MVN: orderbyManitas()");
	  	
	  	var page = false;

	  	//First prepare the visual feedback
	  	$("#main").prepend("<div class='indicator'><span class='spinner'><img src='/style/img/loader.gif' /> Cargando y ordenando posts, espera...</span></div>");
	  	$(".largecol").prepend("<div id='mvn-order-results'></div>");

	  	$("#main").addClass("mvn-loading-all");
	  	$(".post").first().addClass("mvn-first-post");
	  	$("form .post").addClass("mvn-fake-post");
	  	
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

						insertXHR(data, page, current_page);
						page++;
		  			if(page <= last_page){ loadPages(page, last_page, current_page); }else{ applyOrder(); }

					}
				});
	  	}
	  }



	  function applyOrder(){
	  	console.log("APPLY ORDER");
			var posts = $(".post:not(.mvn-fake-post)");
			var likes = 0;

			for (i = 0; i <= posts.length - 1; i++){
				likes = $(posts[i]).find(".mola").text();
	  		$(posts[i]).attr("data-likes", likes);
	  		if(likes == 0){ $(posts[i]).css("display","none"); }
	  	}

			posts.sort(function (a, b){

		    a = parseInt($(a).attr("data-likes"), 10);
		    b = parseInt($(b).attr("data-likes"), 10);

				return ((a < b) ? 1 : ((a > b) ? -1 : 0));
			});

			window.scrollTo(0, 0);
			$("#mvn-order-results").append(posts);
			$(".mvn-loading-all").removeClass("mvn-loading-all");

			reverseQuote();
	  }

	  $(".masmola").on("click", function(){
	  	//alert("asd");
	  });

	  */


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
    			m.is(":hidden") ? m.fadeIn() : e.flash(n);
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