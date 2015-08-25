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

	  	$("form .post").addClass("mvn-fake-post");
	  	console.log("Loaded post: ",in_post, "- Current page: " + current_page, "- Last page: " + last_page);

	  	userTools();
  		reverseQuote();
  		_pages[current_page] = true;

  	}


	//+-------------------------------------------------------
	//| Infinite scroll
	//| + Loads next page if any.
	//+-------------------------------------------------------
		$(window).scroll(function(){
			//console.log("Loaded post: " + in_post, "- Current page: " + current_page, "- Last page: " + last_page);
			//console.log($(window).scrollTop(), $(document).height(), $(document).height()-200);

			if(_user.scroll && in_post && (current_page < last_page)){
				if($(window).scrollTop() >= ($(document).height() - $(window).height() - 800)){
					loadPage();
				}
			}

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

	  			var postURL = ($(".headlink").length)? $(".headlink").attr("href") + "/" + page : window.location.pathname + "/" + page;

	  			$.ajax({
						url: postURL,

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
							}else{
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
	  function insertXHR(xhr, inArray){
	  	var posts = $('.post', xhr);

		  if(!inArray){
		  	$("#bottompanel").replaceWith($("#bottompanel", xhr));
		  	var bottom = $("#bottompanel", xhr).clone().removeAttr("id").addClass("mvn-ajax-pagination").insertBefore("#bottompanel");
		  	//$(".mvn-ajax-pagination .paginas a").each(function(i,e){ $(e).replaceWith("<span>"+$(e).text()+"</span>"); });
		  }
	  	
	  	for (i = 0; i <= posts.length - 1; i++){
	  		if(posts[i].id && !$(posts[i]).hasClass("postit")){
	  			_posts[posts[i].id.substring(4)] = posts[i];
	  			$(posts[i]).attr("data-likes", $(posts[i]).find(".mola").text()).addClass("mvn-post mvn-ajax");
		  		if(!inArray){ $(posts[i]).insertBefore("#bottompanel"); }
		  	}
	  	}

	  	if(!inArray){
	  		userTools();
	  		reverseQuote();
	  	}

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
  		$(".mvn-mention").remove();
	  	for(key in mentions){
	  		if(mentions[key].length > 1){
	  			
	  			var m = [];

	  			for (var i = mentions[key].length - 1; i >= 0; i--) {
	  				m[i] = mentors[mentions[key][i]] + " <a href='#"+mentions[key][i]+"' rel='"+mentions[key][i]+"' class='quote'>#" +mentions[key][i] + "</a>";
	  			};

	  			$("#post"+key).find(".bwrap").append("<span class='mvn-mention'>Citado por " + m.join(" - ") + "</span>");

	  		}else{
					$("#post"+key).find(".bwrap").append("<span class='mvn-mention'>Citado por " + mentors[mentions[key]] + " <a href='#"+mentions[key]+"' rel='"+mentions[key]+"' class='quote'>#" +mentions[key] + "</a>" + "</span>");
	  		}
	  	}

	  	//console.log(mentions, mentors);
	  }

	//+-------------------------------------------------------
  //| orderbyManitas()
  //| + Loads the whole post and sorts the posts by manitas
  //+-------------------------------------------------------
  	if(in_post){ $("#scrollpages").append("<em class='mvn-orderby-manita'><img src='/style/img/botones/thumb_up.png' alt='Ordenar por manitas' width='14' height='14'></em>"); }
  	$(".mvn-orderby-manita").on("click", function(){ orderbyManitas(); });

  	function orderbyManitas(){
	  	console.log("+ MVN: orderbyManitas()");

	  	//First prepare the visual feedback
	  	$("#main").prepend("<div class='indicator'><span class='spinner'>Cargando y ordenando posts, espera...</span><span class='status-page'></span></div>");
	  	$(".largecol").prepend("<div id='mvn-order-results'></div>");	  	
	  	$("#main").addClass("mvn-loading-all");

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

			userTools();
			reverseQuote();
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