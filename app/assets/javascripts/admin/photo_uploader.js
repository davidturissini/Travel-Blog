var PhotoUploader = Backbone.View.extend({
      initialize:function () {
        var uploader = this;
        this.files = new Backbone.Collection();

        this.files.on("add", function (model) {
          uploader.previewPhoto(model);
        })

        this.files.on("remove", function (model) {
          uploader.removePreview(model);
        })

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
          photo = uploader.files.at(index);
          if( !photo ) { return }

          reader.onprogress = function (f) {
            uploader.__updateProgress(f, index);
          }

          reader.onload = function (f) {
              $.ajax({
                url:uploader.model.url() + "/photos",
                data:{
                  photo:f.target.result
                },
                type:"POST",
                complete:function () {
                  upload( index + 1 )
                },
                success:function (e) {
                  console.log("upload success")
                }
              })
          }

          reader.readAsDataURL( photo.raw );
        }
        upload(0)
      },
      removePreview:function(photo) {
        var elem = this.options.previewElem.querySelector("#" + this.generatePhotoPreviewId(photo));
        elem.parentNode.removeChild(elem);
      },
      previewPhoto: (function () {
        var queue = [], isWorking = false;

        function addToQueue( photo ) {
          queue.push(photo);
          if( !isWorking ) {
            showPreview.call(this, queue[0]);
            isWorking = true;
          }
        }

        function previewDone() {
          queue.shift();
          if( queue.length === 0 ) {
            isWorking = false;
          } else {
            showPreview.call(this, queue[0]);
          }
        }

        function showPreview ( photo ) {
          var uploader = this,
          html = uploader.generatePreviewHTML(photo),
          originalImage = document.createElement("img"),
          photoBlobUrl = window.URL.createObjectURL(photo.raw);

          originalImage.onload = function () {
            var ctx = html.canvas.getContext("2d"),
            ratio = originalImage.height / originalImage.width,
            width = 125, height = width * ratio;

            html.canvas.height = height;
            html.canvas.width = width;
            ctx.drawImage(originalImage, 0, 0, width, height);

            previewDone.call(uploader);
          }

          html.div.appendChild(canvas);
          originalImage.src = photoBlobUrl;
        }

        return addToQueue;
      })(),
      generatePhotoPreviewId:function(photo) {
        return "image-preview-" + photo.cid;
      },
      generatePreviewHTML:function ( photo ) {
        var uploader = this,
        elemId = uploader.generatePhotoPreviewId(photo);
        div = document.createElement("div"),
        canvas = document.createElement("canvas"),
        progress = document.createElement("progress"),
        remove = document.createElement("a")

        remove.className = "delete";

        remove.addEventListener("click", function () {
          uploader.files.remove(photo);
        })

        progress.setAttribute("max", 100);
        progress.setAttribute("value", 0);

        div.className = "image-upload";
        div.id = elemId;
        
        div.appendChild(progress);
        div.appendChild(remove);

        uploader.options.previewElem.appendChild(div);

        return {
          div:div,
          canvas:canvas
        }
      },
      addPhotos:function (photos) {
        for(var i = 0; i < photos.length; i += 1) {
          var model = new Photo(photos[i]);
          this.files.add(model);
        }
      },
      __setupInput:function () {
        var uploader = this;

        uploader.el.addEventListener("change", function (e) {
          var i, files = e.currentTarget.files;
          uploader.addPhotos(files);
          
        });
      },
      __setupDropTarget:function () {
        if( !this.options.dropTarget ) { return }

        (function (uploader) {
          uploader.options.dropTarget.addEventListener("drop", function (event) {
          event.stopPropagation();
          event.preventDefault();

          uploader.addPhotos(event.dataTransfer.files);

          }, false);
        })(this);
      },
      render:function () {
        window.URL = window.URL || window.webkitURL;
        this.__setupDropTarget();
        this.__setupInput();
      }
    });