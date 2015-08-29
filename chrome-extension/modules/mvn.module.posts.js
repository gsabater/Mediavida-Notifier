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

initPostTools();


	//+-------------------------------------------------------
  //| initPostTools()
  //| + Gets an array of the posts on the page to 
  //| + attach and process the information
  //| - $(_posts['93']).css("color","red");
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

	  	//Add flag to .post div that is a fake post
	  	$("form .post").addClass("mvn-fake-post");
	  	console.log("Loaded post: ",in_post, "- Current page: " + current_page, "- Last page: " + last_page);

	  	//Add flag to hidden posts that can be shown for not hide
	  	$(".hiddenmsg").closest(".nopost").addClass("mvn-showpost");

	  	//Add flag to pagination items
	  	$("#scrollpages em").addClass("mvn-page-active");
	  	$("#scrollpages > a:not(.togglefav), #scrollpages > em").each(function(i,e){
	  		$(e).addClass("mvn-post-page").attr("data-mvnpage", $(e).text());
	  	});

	  	//init usertools and quote
	  	userTools();
  		reverseQuote();
  		_pages[current_page] = true;

  		//Create placeholder to avoid js error
  		$.fn.tipsy = function(){ console.log("placeholder"); }

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
				
				if($('.mvn-ajax-pagination').length){

					_scroll = 1;
					_pagination = [0];
					var scrollPos = $(document).scrollTop();

					$('.mvn-ajax-pagination').each(function(i,e){
						_pagination[i] = $(e).position().top;
					});

					for(i in _pagination){

						if((scrollPos+100) >= _pagination[i]){
								_scroll = parseInt(i)+2; //console.log("set "+_scroll,i);

							if(_pagination[i+1]){
								if(scrollPos+100 < _pagination[i+1]){
									_scroll = parseInt(i)+3; //console.log("_set "+_scroll,i);
								}
							}
						}
					}

					$(".mvn-page-active").addClass("mvn-page-not-active");
					if(!$(".mvn-post-page[data-mvnpage='" + _scroll + "'").length){
						prev = $(".mvn-post-page[data-mvnpage='" + (_scroll-1) + "'");
						_new = prev.clone();
						_new.attr({"href":"javascript:void(0);", "data-mvnpage": _scroll});
						_new.text(_scroll).insertAfter(prev);
					}
					$(".mvn-post-page[data-mvnpage='" + _scroll + "'").addClass("mvn-page-active").removeClass("mvn-page-not-active");
					//console.log(_pagination, scrollPos+100, "pagina "+ _scroll);
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
	  		/*
	  		if(mentions[key].length > 1){
	  			
	  			var m = [];

	  			for (var i = mentions[key].length - 1; i >= 0; i--) {
	  				m[i] = mentors[mentions[key][i]] + " <a href='#"+mentions[key][i]+"' rel='"+mentions[key][i]+"' class='quote'>#" +mentions[key][i] + "</a>";
	  			};

	  			$("#post"+key).find(".bwrap").append("<span class='mvn-mention'>Citado por " + m.join(" - ") + "</span>");

	  		}else{
					$("#post"+key).find(".bwrap").append("<span class='mvn-mention'>Citado por " + mentors[mentions[key]] + " <a href='#"+mentions[key]+"' rel='"+mentions[key]+"' class='quote'>#" +mentions[key] + "</a>" + "</span>");
	  		}
	  		*/
	  	}

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


	//+-------------------------------------------------------
	//| Hide Nopost
	//+-------------------------------------------------------
		window.setTimeout(function(){ 
			if(_user.hideNopost){
				$("body").addClass("mvn-hide-nopost");
			}
		}, 200);
