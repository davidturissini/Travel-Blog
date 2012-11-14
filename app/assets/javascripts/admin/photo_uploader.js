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
      uploadFiles:function () {
        var uploader = this,
        uploaded = [],
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

        function uploadPhoto (index) {
            var photo = uploader.files.at(index),
            hash = new FormData();

           

            if( photo.get("title") ) {
              hash.append("photo[title]", photo.get("title"));
            }

            if( photo.get("description") ) {
              hash.append("photo[title]", photo.get("description"));
            }

            function go() {


              var xhr = new XMLHttpRequest();
              xhr.open('POST', uploader.model.url() + "/photos");
              xhr.onload = function (e) {
                uploaded.push(photo);
                h5.innerHTML = "Uploaded " + uploaded.length + " of " + uploader.files.length;  
                progress.setAttribute("value", uploaded.length);
                if( uploaded.length == uploader.files.length ) {
                  uploader.trigger("photos_uploaded", {photos:uploader.files})
                } else {
                  uploadPhoto(index + 1);
                }
              };

              xhr.send(hash);
            }

             if( photo.getRaw() instanceof Element ) {
              hash.append('photo[url]', photo.getRaw().getAttribute("src"));
              go();
            } else {
              var reader = new FileReader();
              
              reader.onload = function () {
                hash.append('photo[binary]', photo.getRaw());
                go();
              }

              reader.readAsBinaryString(photo.getRaw());
              
            }
            
          
        }

        uploadPhoto(0);
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
        remove = document.createElement("a");

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
      allowedExtensions:function () {
        return ["jpg", "jpeg", "png", "gif"];
      },
      validateFile:function (file) {
        var types = this.allowedExtensions(),
        fileNameSplit = file.name.split("."),
        extension = fileNameSplit[fileNameSplit.length - 1];
        if( !extension ) { debugger; return false }

        for(var x in types) {
          var regexp = new RegExp(types[x]);
          if( regexp.test(extension.toLowerCase()) ) {
            return true;
          }
        }

        return false;
      },
      addPhotos:function (photos) {
        for(var i = 0; i < photos.length; i += 1) {
          if( this.validateFile(photos[i]) ) {
            var model = new Photo(photos[i]);
            this.addPhoto(model);
          }
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