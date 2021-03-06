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
// Imgur rate limits: http://api.imgur.com/#limits
//=================================================================

  var buttonBar = "<div class='mvn-redactor-container'>"+
                    "<ul class='mvn-redactor-bar'>" +
                    "<li data-open='[b]' data-close='[/b]'><i class='fa fa-bold'></i></li>" +
                    "<li data-open='[i]' data-close='[/i]'><i class='fa fa-italic'></i></li>" +
                    "<li data-open='[s]' data-close='[/s]'><i class='fa fa-strikethrough'></i></li>" +
                    "<li data-open='[u]' data-close='[/u]'><i class='fa fa-underline'></i></li>" +

                    "<li class='separator'>·</li>" +

                    "<li data-open='[list]*' data-close='[/list]'><i class='fa fa-list-ul'></i></li>" +
                    "<li data-open='[center]' data-close='[/center]'><i class='fa fa-align-center'></i></li>" +

                    "<li class='separator'>·</li>" +

                    "<li data-open='[url=]' data-close='[/url]'><i class='fa fa-link'></i></li>" +
                    "<li data-open='[img]' data-close='[/img]'><i class='fa fa-picture-o'></i></li>" +
                    "<li data-open='[video]' data-close='[/video]'><i class='fa fa-video-camera'></i></li>" +
                    "<li data-open='[audio]' data-close='[/audio]'><i class='fa fa-music'></i></li>" +
                    "<li data-open='[tweet]' data-close='[/tweet]'><i class='fa fa-twitter'></i></li>" +
                    "<li data-open='[embed]' data-close='[/embed]'><i class='fa fa-steam'></i></li>" +

                    "<li class='separator'>·</li>" +

                    "<li data-open='[spoiler=]' data-close='[/spoiler]'><i class='fa fa-eye-slash'></i></li>" +
                    "<li data-open='[spoiler=NSFW]' data-close='[/spoiler]'><i class='fa fa-female' style='color: #B90A0A !important;'></i></li>" +

                    "<li class='separator'>·</li>" +

                    "<li data-open='[bar]' data-close='[/bar]'><i class='fa fa-quote-right'></i></li>" +
                    "<li data-open='[code]' data-close='[/code]'><i class='fa fa-code'></i></li>" +

                    "<li class='show-macros' style='float:right;'><i class='fa fa-commenting-o'></i></li>" +
                    "<li class='show-smileys' style='float:right;'><i class='fa fa-smile-o'></i></li>" +
                  "</ul>"+

                  "<div id='div' class='mvn-dropzone'>" +
                    "<div class='close'><i class='fa fa-times-circle'></i></div>" +
                    "<span class='msg'><i class='fa fa-cloud-upload'></i> Suelta para subir a Imgur</span>" +
                    "<span class='uploading'><i class='fa fa-circle-o-notch fa-spin'></i> Subiendo...</span>" +
                    "<div class='error' style='margin-top: 70px;'><i class='fa fa-exclamation-circle'></i> No se ha podido subir la imagen.<br><span class='error' style='font-size:12px; line-height: 10px;'></span></div>" +
                  "</div>" +
                "</div>";
  
  //+-------------------------------------------------------
  //| redactor()
  //| + Adds a custom button bar to extend the textarea
  //+-------------------------------------------------------
    function redactor(el){
      //console.warn("REDACTOR ATTACHED");
      //$("#postform").show();

      // Stop execution on specific pages
      if($("body#mensajes").length){ return false; }

      // Hide and delete both Mediavida and UT button bars via CSS

      // Create custtom button bar on selected item or default reply box
      if(!el){ $( buttonBar ).insertBefore("textarea#cuerpo");
      }else{   $( buttonBar.replace("<li class='show-smileys' style='float:right;'><i class='fa fa-smile-o'></i></li>", "") )
                 .insertBefore("textarea.mvn-redactor-active"); }
      
      // Apply a big class to redactor if needed
      if($("#cabecera").length){ $(".mvn-redactor-container").addClass("big"); }
      if($("#postear").length){ $(".mvn-redactor-container").addClass("big"); }

      // Create macros panel, _mvnLS is not accessible on top
      var macros = "";

      for(i in _mvnLS.macros){
        macros = macros + "<div data-id='"+i+"'><span data-macro='"+ _mvnLS.macros[i].value +"'>" + _mvnLS.macros[i].name + "</span> <i class='fa fa-times'></i></div>"}
        var macrosPanel = "<div class='macros-panel'>" + macros +
          "<div class='add-macro'>Añadir texto seleccionado con el nombre <input type='text' /><div class='save-macro'>Guardar</div></div>" +
        "</div>";

      $( macrosPanel ).insertAfter(".mvn-dropzone");

    }

  //+-------------------------------------------------------
  //| insertText()
  //| + Insert shortcode in textarea area
  //+-------------------------------------------------------
    function insertText(openTag, closeTag){

      var textArea = ( $(".mvn-redactor-active").length ) ? $(".mvn-redactor-active") : $('#cuerpo'); //$(':focus')

      var len = textArea.val().length;
      var start = textArea[0].selectionStart;
      var end = textArea[0].selectionEnd;
      var selectedText = textArea.val().substring(start, end);
      var replacement = openTag + selectedText + closeTag;

      textArea.val(textArea.val().substring(0, start) + replacement + textArea.val().substring(end, len));
      
      textArea[0].selectionStart = textArea[0].selectionEnd = start + openTag.length + selectedText.length;
      textArea.focus();
      return false;

    }

  //+-------------------------------------------------------
  //| + action on redactor bar element
  //+-------------------------------------------------------
    $("body").on("click", "ul.mvn-redactor-bar li", function(e){

      if($(this).hasClass("separator")){    return false; }
      if($(this).hasClass("show-smileys")){ $("#smilies").toggle(); $(".macros-panel").hide();   return false; }
      if($(this).hasClass("show-macros")){  $("#smilies").hide();   $(".macros-panel").toggle(); return false; }

      insertText($(this).attr("data-open"), $(this).attr("data-close"));

    });

  //+-------------------------------------------------------
  //| + invoque redactor on editable post.
  //+-------------------------------------------------------
    $("body").on("mouseenter", "div.msg div.body div textarea", function(e){

      // If the redactor is already attached, dont apply it again
      $(this).off();
      if($(this).hasClass("mvn-redactor-enabled")){ return false; }

      // Toggle active textarea
      $(".mvn-redactor-active").removeClass("mvn-redactor-active");
      $(this).addClass("mvn-redactor-enabled mvn-redactor-active");

      // call redactor with the textarea ref
      redactor(this);

    });    

  //+-------------------------------------------------------
  //| + Toggle smilies and dropzone panels on use
  //+-------------------------------------------------------
    $("#smilies a").on("click", function(){
      $("#smilies").toggle();
    });

    $("body").on("click", ".mvn-dropzone .close" , function(){
      $(".mvn-dropzone").hide();
      $(".mvn-dropzone .msg").show();
      $(".mvn-dropzone .uploading").hide();
    });

  //+-------------------------------------------------------
  //| + Toggle dropzone area on drag item
  //+-------------------------------------------------------
    $(document.body).on('dragenter', function(e){
      $(".mvn-dropzone").show();
    });

    $("body").on("dragleave", ".mvn-dropzone", function(e){
      //$(".mvn-dropzone").hide();
    });

  //+-------------------------------------------------------
  //| + Insert a macro
  //+-------------------------------------------------------
    $("body").on("click", ".macros-panel span", function(e){
      $(".macros-panel").toggle();
      insertText($(this).attr("data-macro"), "");
    });

  //+-------------------------------------------------------
  //| + Save a macro
  //+-------------------------------------------------------
    function saveMacro(){
      var textArea = $('#cuerpo');
      var inputValue = ($(".macros-panel input").val())? $(".macros-panel input").val() : Math.random().toString(36).substring(4);

      var start = textArea[0].selectionStart;
      var end = textArea[0].selectionEnd;
      var selectedText = textArea.val().substring(start, end).replace(/'/g, "&#39;");

      $("<div><span data-macro='" + selectedText + "'>" + inputValue + "</span></div>").insertBefore(".add-macro");
      $(".macros-panel input").val("");

      var obj = {"name": inputValue, "value": selectedText};
      _mvnLS.macros.push(obj);

      chrome.runtime.sendMessage({mvnLS: _mvnLS});
    }

     $("body").on("keypress", ".add-macro", function(e){
      if (e.which == 13){
        saveMacro();

        e.preventDefault();
        e.stopPropagation();
        return false;        
      }
    });

    $("body").on("click", ".macros-panel .save-macro", function(e){
      saveMacro();

      e.preventDefault();
      e.stopPropagation();
      return false; 
    });


  //+-------------------------------------------------------
  //| + Macros remove
  //+-------------------------------------------------------
    $("body").on("click", ".macros-panel i", function(e){
      var x;
      var r = confirm("¿Estás seguro de querer eliminar esta macro?");
      if(!r){
        e.preventDefault();
        return false; }

      $(this).closest("div").remove();

      // Remove from array
      var item = $(this).closest("div").attr("data-id");
      _mvnLS.macros.splice(item,1);

      // Store DB
      chrome.runtime.sendMessage({mvnLS: _mvnLS});
    });

  //+-------------------------------------------------------
  //| + Dropzone handling and upload
  //+-------------------------------------------------------

    $("body").on("dragover", "#div, #cuerpo", function(e){
      e.preventDefault();
      e.stopPropagation();
    });

    $("body").on("dragenter", "#div", function(e){
      e.preventDefault();
      e.stopPropagation();
    });

    $("body").on("drop", "#div", function(e){
      if(e.originalEvent.dataTransfer){
        if(e.originalEvent.dataTransfer.files.length) {
          e.preventDefault();
          e.stopPropagation();
          upload(e.originalEvent.dataTransfer.files);
        }   
      }
    });

    function upload(files){

      var file = files[0];
      var reader  = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = function (){

        $(".mvn-dropzone .msg").hide();
        $(".mvn-dropzone .error").hide();
        $(".mvn-dropzone .uploading").show();

        var base64 = reader.result;
        if(base64){
          base64 = base64.split(";base64,");
          base64 = base64[1];
        }

        //console.log(base64);

        $.ajax({ 
          url: 'https://api.imgur.com/3/image',
          headers: { 'Authorization': "Client-ID bc9b5d3961e99d2" },
          type: 'POST',
          data: { 
            'image': base64,
            "type" : "base64"
          },
          //processData: false,
          success: function(data) { 
            insertText('[img]'+data.data.link,'[/img]');
            $(".mvn-dropzone").hide();
            $(".mvn-dropzone .msg").show();
            $(".mvn-dropzone .uploading").hide();  
          },
          error: function(data) { 

            $(".mvn-dropzone div.error span.error").text(data.responseJSON.data.error);

            $(".mvn-dropzone .msg").hide();
            $(".mvn-dropzone .uploading").hide();
            $(".mvn-dropzone .error").show();
            console.log(data);
          }
        });

      }

    }

/*
    var droppedFiles = false;

    $("#cuerpo").on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
    })
    .on('dragover dragenter', function() {
      $(".has-advanced-upload").addClass('is-dragover');
    })
    .on('dragleave dragend drop', function() {
      $(".has-advanced-upload").removeClass('is-dragover');
    })
    .on('drop', function(e) {
      droppedFiles = e.originalEvent.dataTransfer.files;
    });
    */