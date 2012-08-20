var LocationForm = Backbone.View.extend({
   initialize: function () {
    var form = this,
    loc = form.model

    form.modal = new ModalDialog({
      parentElem:this.el
    })
    
    
    form._bindModelChanges()

    this.serverMessages = document.getElementById("server-messages")

    var fields = ["description", "summary", "location_type_id", "latitude", "longitude", "title", "flickr_set", "kml_url"]
     fields.forEach(function (field) {
      document.getElementById("location-" + field).addEventListener("change", function (e) {
       loc.set(field, e.currentTarget.value)
      })

      document.getElementById("location-has_visited").addEventListener("change", function (e) {
       loc.set({has_visited: e.currentTarget.checked})
      })
    })
 
   },
   _updateFormField:function (field) {
      var loc = this.model,
      elem = document.getElementById("location-" + field),
        newVal = loc.get(field)
        if( elem.value != newVal) {
          elem.value = newVal
        }
   },
   _bindModelChanges: function () {
    var form = this,
    loc = form.model
    loc.on("change", function (e, options) {
     if( options.changes.photo_url ) {
       var photoSection = document.getElementById("location-photo")
       photoSection.getElementsByTagName("img")[0].setAttribute("src", this.get("photo_url")) 
     }

     if( options.changes.has_visited ) { 
      if( loc.get("has_visited") ) {
      document.getElementById("location-has_visited").setAttribute("checked", "checked")
      } else {
        document.getElementById("location-has_visited").removeAttribute("checked")
      }
     }

     [].forEach.call(["latitude", "longitude"], function (field) {

      if( options.changes[field] ) {
        form._updateFormField(field)
       }
     })
   
     if( options.changes.latitude || options.changes.longitude ) {
      form._focusMap()
     }
 
     if( options.changes.flickr_set ) { 
      form.showPhotos()
     }
    })
   },
   _focusMap: function () {
    this.map.panTo(new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude")))
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
         loc.set({photo_url: e.url()})
         modal.close()
        })
       })
       form.modal.setView( flickrPhotos )
       form.modal.setTitle("Select a photo for " + loc.get("title"))
       form.modal.render()

      }
     }
    })
   },
   successMessage:function (message) {
    var success = document.createElement("p"),
    text = document.createTextNode(message)
    success.className = "success"
    success.appendChild(text)
    this.serverMessages.innerHTML = ""
    this.serverMessages.appendChild(success)
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

    form.cityField = new CityField({
        model: loc,
        map: form.map,
        input: document.getElementById("location-city")
      }).render()

    form.stateField = new StateField({
          model: loc,
          map: form.map,
          input: document.getElementById("location-state")
        }).render()
    
    form.countryField = new CountryField({
          el: form.el.querySelector(".location-countries-field"),
          model: loc,
          map: form.map,
          textElem: document.getElementById("location-country_name"),
          input: document.getElementById("location-country_id")
        }).render();

    form.el.querySelector("#location-photo figcaption").addEventListener("click", function () {
      form.showPhotos()
    })

    form.el.querySelector(".show-map").addEventListener("click", function () {
      form.showMap()
    })

    document.getElementById("location-form").onsubmit = function (e) {
     e.preventDefault()
     loc.jsonPrefix = true
     loc.save({}, {
      success:function () {
        form.successMessage(loc.get("title") + " successfully saved.")
      },
      error: function () {
        form.errorMessage("There was a problem with your request")
      }
     })
    }
   }
  })