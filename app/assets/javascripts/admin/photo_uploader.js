var PhotoUploader = Backbone.View.extend({
      initialize:function () {
        this.files = [];
      },
      __updateProgress:function (progressEvent, index) {
        var progressElem = document.getElementById("image-preview-" + index).getElementsByTagName("progress")[0],
        progress = (progressEvent.loaded / progressEvent.total) * 100;
        if( progressElem.getAttribute("value") === progressElem.getAttribute("max") ) {
          progressElem.setAttribute("value", 0);
        }
        progressElem.setAttribute("value", progress);
      },
      uploadFiles:function () {
        var uploader = this;

        function upload (index) {
          var reader = new FileReader(),
          photo = uploader.files[index];
          if( !photo ) { return }

          reader.onprogress = function (f) {
            uploader.__updateProgress(f, index);
          }

          reader.onload = function (f) {
              $.ajax({
                url:"/me/us-101/photos",
                data:{
                  photo:f.target.result
                },
                type:"POST",
                complete:function () {
                  upload( index + 1 )
                },
                success:function (e) {
                  debugger
                }
              })
          }

          reader.readAsDataURL( photo );
        }
        upload(0)
      },
      previewFiles:function () {
        var uploader = this;

        var loadPreview = function (index) {
            var photo = uploader.files[index];
            if( !photo ) { return }

            var div = document.createElement("div"),
            canvas = document.createElement("canvas"),
            progress = document.createElement("progress")

            progress.setAttribute("max", 100);
            progress.setAttribute("value", 0);

            div.className = "image-upload";
            div.id = "image-preview-" + index;
            
            div.appendChild(progress);

            uploader.options.previewElem.appendChild(div);

            var originalImage = document.createElement("img"),
            s = window.URL.createObjectURL(photo)

            originalImage.onload = function () {
              
              var ctx = canvas.getContext("2d"),
              ratio = originalImage.height / originalImage.width,
              width = 125, height = width * ratio;

              canvas.height = height;
              canvas.width = width;
              ctx.drawImage(originalImage, 0, 0, width, height);
              loadPreview( index + 1 );
            }
            div.appendChild(canvas);
            originalImage.src = s;
            
          };

          loadPreview( 0 )
      },
      __setupInput:function () {
        var uploader = this;

        uploader.el.addEventListener("change", function (e) {
          var i, files = e.currentTarget.files;
          uploader.files = files;

          if( uploader.options.previewElem ) {
            uploader.previewFiles();
          }
        });
      },
      render:function () {
        window.URL = window.URL || window.webkitURL;
        this.__setupInput();
      }
    });