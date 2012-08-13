var LocationForm = Backbone.View.extend({
   initialize: function () {
    var form = this,
    loc = form.model
    form.map = new google.maps.Map(document.getElementById("location-map"), {
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
    form._bindModelChanges()
    

    this.serverMessages = document.getElementById("server-messages")

    var fields = ["summary", "location_type_id", "latitude", "longitude", "title", "city", "flickr_set", "kml_url"]
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

     [].forEach.call(["city", "latitude", "longitude", "country_id"], function (field) {

      if( options.changes[field] ) {
        form._updateFormField(field)
       }
     })

     if( options.changes.country ) {
      var country = this.get("country"),
      country_id = country.get("id")
      document.getElementById("location-country_name").innerHTML = country.get("name")

      this.set({country:null, country_id:country_id}, {silent:true})
      form._updateFormField("country_id")
     }
   
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
    countryList = new CountryCollection()
    countryList.fetch({
      success:function (countries) {
        google.maps.event.addListener(form.map, "click", function (mapEvent) {
         geocoder = new google.maps.Geocoder();
         geocoder.geocode({latLng:mapEvent.latLng}, function (e) {
          var address = (function () {
           var hash
           for(var i in e) {
            if( e[i].types[0] == "locality" ) {
             hash = e[i]
            }
          }
          if( hash ) { 
           return hash.formatted_address 
          }
          })(),
          country = (function () {
           for(var i in e) {
            if( e[i].types[0] == "country" ) { 
              var countryName = e[i].formatted_address
              return countries.where({name:countryName})[0]
            }
           }
          })(), city
          if( address ) {
           city = address.split(",")[0]
          }

          loc.set({
           city: city,
           country: country,
           latitude: mapEvent.latLng.lat(),
           longitude: mapEvent.latLng.lng()
          })
         })
        })
      }
    })
   },
   drawMapMarker: function () {
    this.mapMarker.render()
   },
   showPhotos: function () {
    var loc = this.model,
    photoUl = document.getElementById("flickr-photos").getElementsByTagName("ul")[0]
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
        })
       })
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
   render: function () {
    var form = this,
    loc = form.model
    form.showPhotos()
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