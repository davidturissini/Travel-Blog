var LocationForm = Backbone.View.extend({
   initialize: function () {
    var form = this,
    loc = form.model

    form.modal = new ModalDialog({
      parentElem:this.el
    })
    
    
    form._bindModelChanges();

    this.serverMessages = document.getElementById("server-messages");

    var fields = ["description", "summary", "title", "kml_url"]
     fields.forEach(function (field) {
      document.getElementById("location-" + field).addEventListener("change", function (e) {
       loc.set(field, e.currentTarget.value);
      })

    })
 
   },
   _bindModelChanges: function () {
    var form = this,
    loc = form.model
    loc.on("change", function (e, options) {
     if( options.changes.photo_url ) {
       var photoSection = document.getElementById("location-photo")
       photoSection.getElementsByTagName("img")[0].setAttribute("src", this.get("photo_url")) 
     }
 
     if( options.changes.flickr_set ) { 
      form.showPhotos()
     }
    })
   },
   _bindMapClicks: function () {
    var form = this,
    loc = form.model,
    decoder = new GeocodeDecoder()

    google.maps.event.addListener(form.map, "click", function (mapEvent) {
      decoder.decode(mapEvent.latLng, {
        success:function (result) {
          if( result.data ) {
            var country = form.countryField.collection.findByName(result.data.country),
            country_id = country ? country.id : ""
            loc.set({
              country_id: country_id,
              city: result.data.city || "",
              state: result.data.state || ""
            })
          }
        }
      })
      
      loc.set({
          latitude: mapEvent.latLng.lat(),
          longitude: mapEvent.latLng.lng()
        })
    })


   },
   drawMapMarker: function () {
    this.mapMarker.render()
   },
   showPhotos: function () {
    var loc = this.model,
    form = this,
    flickrPhotos = document.createElement("section")
    photoUl = document.createElement("ul")
    
    flickrPhotos.id = "flickr-photos"
    flickrPhotos.appendChild(photoUl)
    photoUl.innerHTML = "" 
    loc.photos({
     success:function (e) {
      var photos = []
      if( e.photoset && e.photoset.photo && e.photoset.photo.length > 0 ) {
       $.each(e.photoset.photo, function (idx, e) {
        e.url = function () {
         return "http://farm" + e.farm + ".static.flickr.com/" + e.server + "/" + e.id + "_" + e.secret + ".jpg"
        } 
        e.thumbnail = function (size) { 
         var ary = e.url().split("."),
         index = ary.length - 2
         ary[index] = ary[index] + "_" + size
         return ary.join(".");
        }
        var img = document.createElement("img"),
        li = document.createElement("li")
        img.setAttribute("src", e.url())
        li.appendChild(img) 
        photoUl.appendChild(li)
        li.addEventListener("click", function () {
         loc.set({photo_url: e.url()});
         modal.close();
        })
       })
       form.modal.setView( flickrPhotos );
       form.modal.setTitle("Select a photo for " + loc.get("title"));
       form.modal.render();
      }
     }
    })
   },
   successMessage:function (message) {
    var success = document.createElement("p"),
    text = document.createTextNode(message)
    success.className = "success";
    success.appendChild(text);
    this.serverMessages.innerHTML = "";
    this.serverMessages.appendChild(success);
   },
   errorMessage: function (message) {
    var error = document.createElement("p"),
    text = document.createTextNode(message)
    error.className = "error"
    error.appendChild(text)
    this.serverMessages.innerHTML = ""
    this.serverMessages.appendChild(error)
    
   },
   showMap: function () {
    var mapElem = document.createElement("figure"),
    form = this,
    loc = this.model
    mapElem.className = "map"

    form.modal.setView( mapElem )
    form.modal.setTitle("Select location for " + loc.get("title"))
    form.modal.render()

    form.map = new google.maps.Map(mapElem, {
     zoom: 4,
     center: new google.maps.LatLng(loc.get("latitude"), loc.get("longitude")),
     mapTypeId: google.maps.MapTypeId.HYBRID
    })

    
    form._bindMapClicks()
    this.mapMarker = new LocationMarker({
      model:loc,
      map:form.map,
      locationType:loc.locationType
     })
    form.drawMapMarker()
   },
   render: function () {
    var form = this,
    loc = form.model

    form.el.querySelector("#location-photo figcaption").addEventListener("click", function () {
      form.showPhotos();
    })

    form.el.querySelector(".show-map").addEventListener("click", function () {
      form.showMap();
    })

    form.stateField = new StateField({
          model: loc,
          input: document.getElementById("location-state")
        }).render()
    
    form.countryField = new CountryField({
          el: form.el.querySelector(".location-countries-field"),
          model: loc
        }).render();


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

    var photoUploader = new PhotoUploader({
      model:this.model,
      el:this.el.querySelector(".photo_upload"),
      previewElem:this.el.querySelector("#photo-container")
    });

    photoUploader.render();

    document.getElementById("location-form").onsubmit = function (e) {
     e.preventDefault();
     loc.jsonPrefix = true;

     photoUploader.uploadFiles();
/*
     loc.save({}, {
      success:function () {
        form.successMessage(loc.get("title") + " successfully saved.");
      },
      error: function () {
        form.errorMessage("There was a problem with your request");
      }
     })

     */
    }
   }
  })