var LocationForm = Backbone.View.extend({
   initialize: function () {
    var form = this,
    loc = form.model

    form.modal = new ModalDialog({
      parentElem:this.el
    })
    
    
    form._bindModelChanges();

    this.serverMessages = document.getElementById("server-messages");

    var fields = []
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
   render: function () {
    var form = this,
    loc = form.model,
    locMap = new LocationMap({
      model:loc
    });

    form.el.querySelector(".show-map").addEventListener("click", function () {
      locMap.render();
    })

    form.stateField = new StateField({
          model: loc,
          input: document.getElementById("location-state")
        }).render()
    
    form.countryField = new CountryField({
          el: form.el.querySelector(".location-countries-field"),
          model: loc
        }).render();

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

     loc.save({}, {
      success:function () {
        form.successMessage(loc.get("title") + " successfully saved.");
      },
      error: function () {
        form.errorMessage("There was a problem with your request");
      }
     })
     
    }
   }
  })