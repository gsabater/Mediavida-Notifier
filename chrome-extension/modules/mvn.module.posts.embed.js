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
// 
//=================================================================


	var iconIMG  		= "<i class='fa fa-picture-o mvn-ico-embed'></i>";
	var iconYTB  		= "<i class='fa fa-youtube-play mvn-ico-embed'></i>";
	var iconMP3 		= "<i class='fa fa-volume-up mvn-ico-embed'></i>";
	var iconVINE 		= "<i class='fa fa-vine mvn-ico-embed'></i>";
	var iconINST 		= "<i class='fa fa-instagram mvn-ico-embed'></i>";
	var iconVIDEO  	= "<i class='fa fa-video-camera mvn-ico-embed'></i>";
	var iconCHROME 	= "<i class='fa fa-chrome mvn-ico-embed'></i>";
	var iconLOADING	= "<i class='fa fa-circle-o-notch fa-spin mvn-ico-embed'></i>";


	var embedIMG 		= "<img src='placeholder' class='mvn-embed' />";
	var embedIMGUR 	= '<video autoplay="" loop="" muted=""><source type="video/webm" src="placeholder"></video>';
	var embedYTB 		= "<div class='embedded'><div class='youtube_lite'><a href='javascript:void(0)' data-youtube='placeholder' data-width='620' data-height='349' data-init='false' style=\"background-image:thumbnailholder\"><span class='play'></span></a></div></div>";
	var embedVINE		= "<iframe src='placeholder' width='480' height='480' frameborder='0' class='mvn-embed-vine'></iframe><script src='https://platform.vine.co/static/scripts/embed.js'></script>";
	var embedINST 	= '<br><iframe allowtransparency="true" frameborder="0" height="533" scrolling="no" src="placeholder" width="459"></iframe>';
	var embedMP3		= "<br><audio controls><source src='placeholder' type='audio/mpeg'></audio><br>";

	//+-------------------------------------------------------
  //| embedMedia()
  //| + Try to autoembed image links and youtube links into 
  //| + posts with a hover tooltip
  //+-------------------------------------------------------
  	function embedMedia(){


		//| + Plain images
  	//+-------------------------------------------------------
  		var mediaIMG 		= $('.post .msg a[href*=".gif"]:not(.mvn-embeded), .post .msg a[href*=".jpg"]:not(.mvn-embeded), .post .msg a[href*=".png"]:not(.mvn-embeded)');
			mediaIMG.each(function(i,e){

				if($(e).attr("href").indexOf(".gifv") > -1){ return true; } //do not track gifv from imgur.
				if(($(e).children().length == 0)&&($(e).text().substring(0,10) == $(e).attr("href").substring(0,10))){
					
					$(e).addClass("mvn-embeded mvn-tooltip tooltip-effect-1 mvn-embed-image").removeAttr("title").removeAttr("title");
					$(e).closest(".post").addClass("mvn-overflow-visible");
					
					$(e).append( iconIMG );
					$(e).attr("data-magnific", "image");

					media = embedIMG.replace("placeholder",$(e).attr("href"));
					if(_user.media.hover){ $(e).append('<span class="tooltip-content">'+ media +'</span>'); }
				}
			});



		//| + Imgur
  	//+-------------------------------------------------------
			var mediaIMGUR 	= $('.post .msg a[href*="imgur.com"]:not(.mvn-embeded)');  	
			mediaIMGUR.each(function(i,e){

				if($(e).find("img").length){ return true; }

				$(e).addClass("mvn-embeded mvn-tooltip tooltip-effect-1 mvn-embed-imgur").removeAttr("title").removeAttr("title");
				$(e).closest(".post").addClass("mvn-overflow-visible");

				imgURL = $(e).attr("href").split("/");
				imgURL = imgURL[imgURL.length -1];

				if((imgURL.indexOf(".jpg") > -1)||
					 (imgURL.indexOf(".png") > -1)||
					 ((imgURL.indexOf(".gif") > -1)&&(imgURL.indexOf(".gifv") == -1))){

					media = embedIMG.replace("placeholder", "http://i.imgur.com/"+imgURL);
					
					$(e).append( iconIMG );
					$(e).attr("data-magnific", "imgur-img").attr("data-magnificsrc", "http://i.imgur.com/"+imgURL);
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

						media = (data.data.gifv)? embedIMGUR.replace("placeholder", 'http://i.imgur.com/'+data.data.id+'.webm') : embedIMG.replace("placeholder", data.data.link);
						if(_user.media.hover){ $(e).append('<span class="tooltip-content">'+ media +'</span>'); }

						if(data.data.gifv){ $(e).attr("data-magnific", "imgur-vid").attr("data-magnificsrc", 'http://i.imgur.com/'+data.data.id+'.webm');
						}else{ 							$(e).attr("data-magnific", "imgur-img").attr("data-magnificsrc", data.data.link); }

					});	

				}

			});



	  //| + Videos MP4 & webm
	  //+-------------------------------------------------------
			var mediaVIDEO 	= $('.post .msg a[href*=".mp4"]:not(.mvn-embeded), .post .msg a[href*=".webm"]:not(.mvn-embeded)');
	 		mediaVIDEO.each(function(i,e){

				$(e).addClass("mvn-embeded mvn-tooltip tooltip-effect-1").removeAttr("title").removeAttr("title");
				$(e).closest(".post").addClass("mvn-overflow-visible");

				media = embedIMGUR.replace("placeholder",$(e).attr("href"));
				$(e).append( iconVIDEO );
				
				if(_user.media.hover){ $(e).append('<span class="tooltip-content">'+ media +'</span>');	}
				$(e).attr("data-magnific", "imgur-vid").attr("data-magnificsrc", $(e).attr("href"));

			});



	  //| + Videos Youtube
	  //+-------------------------------------------------------
	  	var mediaYTB 		= $('.post .msg a[href*="://youtu.be"]:not(.mvn-embeded)');
			mediaYTB.each(function(i,e){

				$(e).addClass("mvn-embeded");
				$(e).append( iconYTB ).addClass("mvn-embed-highlight");

				ytbURL = $(e).attr("href").split("/");
				ytbURL = ytbURL[ytbURL.length -1];
				media = embedYTB.replace("placeholder", ytbURL).replace("thumbnailholder", "url('https://i.ytimg.com/vi/"+ytbURL+"/hqdefault.jpg')");
				
				if(_user.media.autoembed){ $( media ).insertBefore( e ); }else{
				if(_user.media.hover){ $(e).addClass("mvn-tooltip tooltip-effect-1").append('<span class="tooltip-content"><img src="'+ location.protocol +'//img.youtube.com/vi/'+ytbURL+'/mqdefault.jpg" /></span>'); }}

				$(e).attr("data-magnific", "youtube").attr("data-magnificsrc", ytbURL );

			});

			mediaYTB = $('.post .msg a[href*="://youtube.com"]:not(.mvn-embeded), .post .msg a[href*="://www.youtube.com"]:not(.mvn-embeded)');
			mediaYTB.each(function(i,e){

				$(e).addClass("mvn-embeded");
				$(e).append( iconYTB ).addClass("mvn-embed-highlight");

				ytbURL = $(e).attr("href").split("v=");
				ytbURL = ytbURL[ytbURL.length -1].split("&");
				ytbURL = ytbURL[0];

				media = embedYTB.replace("placeholder", ytbURL).replace("thumbnailholder", "url('https://i.ytimg.com/vi/"+ytbURL+"/hqdefault.jpg')");
				$(e).attr("data-magnific", "youtube").attr("data-magnificsrc", ytbURL );

				if(_user.media.autoembed){ $( media ).insertBefore( e ); }else{ 
				if(_user.media.hover){ $(e).addClass("mvn-tooltip tooltip-effect-1").append('<span class="tooltip-content"><img src="'+ location.protocol +'//img.youtube.com/vi/'+ytbURL+'/mqdefault.jpg" /></span>'); }}
				

			});		



	  //| + Vine
	  //+-------------------------------------------------------
			var mediaVINE = $('.post .msg a[href*="//vine.co"]:not(.mvn-embeded)');
	 		mediaVINE.each(function(i,e){

				$(e).addClass("mvn-embeded mvn-embed-highlight").removeAttr("title").removeAttr("title");
				$(e).append( iconVINE );

				vineURL = $(e).attr("href").split("/");
				vineURL = vineURL[vineURL.length -1];
				media = embedVINE.replace("placeholder", "https://vine.co/v/"+vineURL+"/embed/simple");

				if(_user.media.autoembed){ $( media ).insertBefore( e ); }
				$(e).attr("data-magnific", "iframe").attr("data-magnificsrc", "https://vine.co/v/"+vineURL+"/embed/simple" );


			});



		//| + INSTAGRAM
  	//+-------------------------------------------------------
			var mediaINST 	= $('.post .msg a[href*="instagram.com"]:not(.mvn-embeded)');  	
			mediaINST.each(function(i,e){

				if($(e).find("img").length){ return true; }

				$(e).addClass("mvn-embeded mvn-embed-highlight").removeAttr("title").removeAttr("title");
				$(e).append( iconINST );

				imgURL = $(e).attr("href").split("/");
				imgURL = (imgURL[imgURL.length -1].length > 1)? imgURL[imgURL.length -1] : imgURL[imgURL.length -2];
				media = embedINST.replace("placeholder", location.protocol+"//instagram.com/p/" + imgURL + "/embed/");

				if(_user.media.autoembed){ $( media ).insertBefore( e ); }
				$(e).attr("data-magnific", "iframe").attr("data-magnificsrc", location.protocol+"//instagram.com/p/" + imgURL + "/embed/" );

			});


		//| + MP3 AUDIO
  	//+-------------------------------------------------------
  		var mediaMP3 		= $('.post .msg a[href*=".mp3"]:not(.mvn-embeded)');
			mediaMP3.each(function(i,e){

				$(e).addClass("mvn-embeded mvn-embed-highlight").removeAttr("title").removeAttr("title");
				$(e).append( iconMP3 );

				media = embedMP3.replace("placeholder",$(e).attr("href"));
				if(_user.media.autoembed){ $( media ).insertBefore( e ); }

				$(e).attr("data-magnific", "audio").attr("data-magnificsrc", $(e).attr("href") );
				
			});


		//| + Mediavida intern
  	//+-------------------------------------------------------
  		if(_user.media.magnificMV){
	  		var mediaMV 		= $('.post .msg a[href*="mediavida.com"]:not(.mvn-embeded)');
				mediaMV.each(function(i,e){

					$(e).addClass("mvn-embeded mvn-embed-highlight").removeAttr("title").removeAttr("title");
					$(e).append( iconCHROME );

					var URL = $(e).attr("href").replace("http://","//").replace("https://","//");
					lastChar = URL.slice(-1);
					URL = ((lastChar == ".")||(lastChar == ","))? URL.slice(0,URL.length-1) : URL;

					$(e).attr("data-magnific", "mediavida").attr("data-magnificsrc", location.protocol + URL );
					
				});
			}	

		}


		$("body").on("click", "a.mvn-embeded", function(e){
			if(_user.media.magnific){ 

				if($(this).data("magnific") == "image"){ console.warn("image", $(this).attr("href"));
					$.magnificPopup.open({
					  items: { src: $(this).attr("href") },
					  type: 'image' }); }

				if($(this).data("magnific") == "imgur-img"){ console.warn("imgur-img", $(this).attr("data-magnificsrc") );
					$.magnificPopup.open({
					  items: { src: $(this).attr("data-magnificsrc") },
					  type: 'image' }); }	

				if($(this).data("magnific") == "imgur-vid"){ console.warn("imgur-vid", $(this).attr("data-magnificsrc") );
					$.magnificPopup.open({
					  items: {
			      src: embedIMGUR.replace("placeholder", $(this).attr("data-magnificsrc")),
			      type: 'inline' }	 }); }			

				if($(this).data("magnific") == "youtube"){ console.warn("youtube", $(this).attr("data-magnificsrc") );
					$.magnificPopup.open({
						items: { src: "http://www.youtube.com/watch?v="+$(this).attr("data-magnificsrc") },
  					type: 'iframe' }); }	

  			if($(this).data("magnific") == "iframe"){ console.warn("youtube", $(this).attr("data-magnificsrc") );
					$.magnificPopup.open({
						items: { src: $(this).attr("data-magnificsrc") },
  					type: 'iframe' }); }	

				if($(this).data("magnific") == "audio"){ console.warn("audio", $(this).attr("data-magnificsrc") );
					$.magnificPopup.open({
					  items: {
			      src: embedMP3.replace("placeholder", $(this).attr("data-magnificsrc")),
			      type: 'inline' }	 }); }

			  if($(this).data("magnific") == "mediavida"){ console.warn("mediavida", $(this).attr("data-magnificsrc") );
					$.magnificPopup.open({
						items: { src: $(this).attr("data-magnificsrc") },
  					type: 'iframe',
  					mainClass: 'mvn-magnific-iframe' }); }


				e.preventDefault();
				return false;
			}
		});
	


