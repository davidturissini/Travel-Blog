var PhotoUploader = Backbone.View.extend({
      initialize:function () {
        var uploader = this;
        this.files = new Backbone.Collection();

        this.files.on("add", function (model) {
          uploader.previewPhoto(model);

          if( uploader.el.className.indexOf("has-photos") === -1 ) {
            uploader.el.className += " has-photos";
          }
        })

        this.files.on("reset", function (e) {
          uploader.options.previewElem = "";
        })

        this.files.on("remove", function (model) {
          uploader.removePreview(model);
          if( uploader.files.length === 0 ) {
            uploader.el.className = uploader.el.className.replace("has-photos", "");
          }
        })

      },
      clear:function () {
        this.files.reset();
      },
      addImage:function (image) {
        image.id = image.src;
        this.addPhotos([image]);
      },
      uploadFiles:(function () {
        var uploaded = [];
        return function () {
          var uploader = this,
          loader = new Loading({
            el:document.body
          }).render(),
          loadingView = document.createElement("div"),
          h5 = document.createElement("h5"),
          progress = document.createElement("progress")

          if( uploader.options.uploadButton ) {
            uploader.options.uploadButton.setAttribute("disabled", "disabled");
            uploader.options.clearButton.setAttribute("disabled", "disabled");
          }

          uploader.trigger("upload_start");

          progress.setAttribute("value", 0);
          progress.setAttribute("max", uploader.files.length);

          h5.innerHTML = "Uploaded 0 of " + uploader.files.length;  
          loadingView.appendChild(h5);
          loadingView.appendChild(progress);

          loader.setLoadingView(loadingView);
          loader.loading();

          function doUpload( options ) {
            var hash = {photo:{}};
            if( options.data ) {
              hash.photo.binary = options.data;
            } else if (options.url) {
              hash.photo.url = options.url;
            }

            if( options.photo.get("title") ) {
              hash.photo.title = options.photo.get("title");
            }

            if( options.photo.get("description") ) {
              hash.photo.description = options.photo.get("description");
            }

            $.ajax({
                url:uploader.model.url() + "/photos",
                data:hash,
                type:"POST",
                complete:function (e) {
                  options.complete(e);
                },
                success:function (e) {
                  options.success(e);
                }
              })
          }

          function upload (index) {
            var photo = uploader.files.at(index);
            if( !photo ) { return }

            photo.getBinary({
              success:function (binary) {
                var hash = {
                  photo:photo,
                  complete:function () {
                    upload( index + 1 )
                  },
                  success:function (e) {
                    uploaded.push(photo);
                    h5.innerHTML = "Uploaded " + uploaded.length + " of " + uploader.files.length;  
                    progress.setAttribute("value", uploaded.length);
                    if( uploaded.length == uploader.files.length ) {
                      uploader.trigger("photos_uploaded", {photos:uploader.files})
                    }
                  }
                }


                if( binary === false ) {
                  hash.url = photo.src();
                } else {
                  hash.data = binary;
                }

                doUpload(hash);

            }})
          }
          upload(0)
        }

      })(),
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
          photoUrl = photo.src();

          originalImage.onload = function () {
            var ctx = html.canvas.getContext("2d"),
            ratio = originalImage.height / originalImage.width,
            width = 125, height = width * ratio;


            if( originalImage.height > originalImage.width || height < 90 ) {
              height = 90;
              width = height * (1 / ratio);
            }

            html.canvas.height = height;
            html.canvas.width = width;
            ctx.drawImage(originalImage, 0, 0, width, height);

            previewDone.call(uploader);
          }

          canvas.width = 100;
          canvas.height = 100;
          html.div.appendChild(canvas);
          originalImage.src = photoUrl;
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
        remove = document.createElement("a")
        remove.innerHTML = "X";

        remove.className = "remove";

        remove.addEventListener("click", function () {
          uploader.files.remove(photo);
        })


        div.className = "image-upload";
        div.id = elemId;
        
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
          this.addPhoto(model);
        }
      },
      addPhoto:function (photo) {
        this.files.add( photo );
      },
      __setupInput:function () {
        var uploader = this;

        uploader.options.input.addEventListener("change", function (e) {
          var i, files = e.currentTarget.files;
          uploader.addPhotos(files);
          
        });
      },
      __setupDropTarget:function () {
        if( !this.options.dropTarget ) { return }

        (function (uploader) {
          uploader.el.addEventListener("dragenter", function (event) {
            uploader.el.className += " dragenter";
          });
          uploader.el.addEventListener("dragleave", function (event) {
            uploader.el.className = uploader.el.className.replace("dragenter", "");
          });
          uploader.options.dropTarget.addEventListener("drop", function (event) {
          event.stopPropagation();
          event.preventDefault();
          uploader.el.className = uploader.el.className.replace("dragenter", "");
          uploader.addPhotos(event.dataTransfer.files);

          }, false);
        })(this);
      },
      __bindUploadButton:function () {
        var uploader = this;
        this.options.uploadButton.addEventListener("click", function (e) {
          uploader.uploadFiles();
        })
      },
      __bindClearButton:function () {
        var uploader = this;
        this.options.clearButton.addEventListener("click", function (e) {
          uploader.clear();
        })
      },
      render:function () {
        this.__setupDropTarget();
        this.__setupInput();
        this.__bindUploadButton();
        this.__bindClearButton();
      }
    });