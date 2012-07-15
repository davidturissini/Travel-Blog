
  var LocationMarker = Backbone.View.extend({
   initialize: function () {
     this.kmlLayer = new google.maps.KmlLayer(this.model.get("kml_url"), {preserveViewport:true,suppressInfoWindows:true})
   },
   remove: function (location) {
     if( this.marker ) {
      this.marker.setMap(null) 
     }
     if( this.kmlLayer ) {
      this.kmlLayer.setMap(null)
     }
    },
    icon: function () {
     var iconUrl = "http://www.baydreaming.com/images/icons/travel.png"
     if( !this.model.has_visited ) {
      iconUrl = "http://www.iconhot.com/icon/png/dot-pictograms/32/suitcase-travel.png" 
     }
     return iconUrl
    },
    draw: function (map) {
     var location = this.model,
     markerHash = {
      position: new google.maps.LatLng(location.get("lat"), location.get("lng")),
      map: map.map,
      title: location.get("post_title"),
      icon:this.icon()
     }
     this.marker = new google.maps.Marker(markerHash) 
     google.maps.event.addListener(this.marker, "click", function (e) {
      location.navigate()
     })
   },
   showLocation: function () {
    window.locationView.show(this.model)
   },
   zoom: function (map) {
    var view = this,
    latLng = new google.maps.LatLng(this.model.get("lat"), this.model.get("lng"))
    map.map.fitBounds( new google.maps.LatLngBounds(latLng,latLng) )
    var event = google.maps.event.addListener(view.marker, "click", function () {
      google.maps.event.removeListener(event)
      view.showLocation() 
    })
   }
  })

  var DriveMarker = LocationMarker.extend({
    draw: function (map) {
      this.kmlLayer.setMap(map.map) 
    },
   zoom: function () {
    var bounds = this.kmlLayer.getDefaultViewport(),
    view = this
    var event = google.maps.event.addListener(this.kmlLayer, "click", function () {
     google.maps.event.removeListener(event)
     window.locationView.show(view.model)
    })
    map.map.fitBounds(bounds)
   }
  })

  var ClimbMarker = LocationMarker.extend({
   icon: function () {
    return "http://cdn0.media.cyclingnews.futurecdn.net/icons/2011/03/31/climb_32.png"
   },
   draw:function (map) {
    var location = this.model,
    markerHash = {
     position: new google.maps.LatLng(location.get("lat"), location.get("lng")),
     map: map.map,
     title: location.get("post_title"),
     icon: this.icon()
    }
    this.kmlLayer.setMap(map.map) 
    this.marker = new google.maps.Marker(markerHash) 
    google.maps.event.addListener(this.marker, "click", function (e) {
     location.navigate()
    })
   },
   zoom: function (map) {
    var bounds = this.kmlLayer.getDefaultViewport(),
    view = this,
    location = view.model,
    clickableElements = [this.kmlLayer, this.marker]
    clickableElements.forEach(function (clickableElem) {
     var event = google.maps.event.addListener(clickableElem, "click", function () {
      google.maps.event.removeListener(event)
      window.locationView.show(view.model)
     })
    })
    if( bounds ) { 
     map.map.fitBounds(bounds)
    }
   }
  })

  var Map = Backbone.View.extend({
   model:Location,
   initialize: function (e) {
    var map = this
    map.options = e.options
    map.router = new LocationRouter()
    map.markerTypes = {
     "climb": ClimbMarker,
     "vacation": LocationMarker,
     "drive": DriveMarker
     }
   },
   setLocations: function (locations) {
     var map = this
     if( map.markers ) {
      map.markers.forEach(function (marker) { 
       marker.remove()
      })
     }
     map.markers = [] 
     locations.each(function (location) {
       var markerClass = map.markerTypes[location.get("post_type")],
       marker = new markerClass({model:location})
       map.markers.push(marker)
       marker.draw(map)
     })
   },
   render: function () {
    this.map = new google.maps.Map(this.el, this.options);
    return this
   },
   unfocus: function () {
    this.map.setOptions(this.options)
   },
   focusLocation: function (location) {
    var map = this,
    marker = map.markers.filter(function (e,a) {return e.model == location })[0]
    window.locationView.hide()
    marker.zoom(map)
   }
 })
   var LocationMenu = Backbone.View.extend({
     expandLocationType:function (locationType) {
       var $locations = $( this.el.getElementsByClassName(locationType) )
       $( this.el.getElementsByTagName("ul") ).css({display:"none"})
       $locations.css({display:"block"})
       this.options.map.setLocations(this.locations[locationType])
     },
     render:function () {
      var map = this.options.map,
      $locations = $( this.el.getElementsByClassName("location") )
      map.on("locationChanged", function (event) {
       var location = event.location
       $locations.removeClass("selected")
       if( location ) { 
        var $loc = $locations.filter(function (idx, e) { 
         return location.get("ID") == $(e).data().json.ID  
        }).first()
        $loc.addClass("selected")
       }
      }) 


      var view = this,
      locationTypes = ["climbs", "vacations", "drives"]
      view.locations = {}
      locationTypes.forEach(function (postType) {
       view.locations[postType] = new LocationsCollection()
       $( "." + postType + " .location", this.el ).each(function (idx, elem) {
        var location = new Blog.PostTypes[postType].className( $(elem).data("json") )
        view.locations[postType].add(location)
        $(elem).click( function (e) {
         e.preventDefault()
         var $target = $(e.currentTarget)
         if( !$target.hasClass("selected") ) {
          map.router.navigateToLocation(location)
         } else {
          map.router.navigateToLocation(null) 
         }
        })
       })
      })

      $( this.el.getElementsByTagName("header") ).click(function (e) {
       var $target = $(e.currentTarget.parentNode)
       view.expandLocationType($target.data("post_type"))
      })

       var match = window.location.href.match(/vacation|drive|climb/)
       if( match && match[0] ) {
        view.expandLocationType(match[0] + "s")
       } else {
        view.expandLocationType("vacations")
       }
     }
   })

var LocationShowView = Backbone.View.extend({
    model: Location,
    show:function (location) {
     this.model = location
     this.render()
    },
    hide:function () {
     this.$el.css({display:"none"})
    },
    close: function () {
      window.map.router.navigateToLocationIndex(this.model.get("post_type"))
      this.hide()
    },
    showHTML: function () {
     var view = this
     this.$el.css({display:"block"})
     $(".close", view.$el).unbind("click").click(function () { 
       view.close()
     })
     $(document).bind("keyup", function (e) { if(e.keyCode == 27) { 
      view.close()
      $(document).unbind("keyup") }  
     })
     if( !window.isStage() ) {
      _gaq.push(["_trackEvent", "Location", "Viewed", view.model.get("post_title")])
     }
    },
    showPhotos: function (photos) {
     var view = this
     $(".photos", view.$el).empty()
       $.each(photos, function(idx, photo) {
       var $img = $( document.createElement("img") ).attr({src:photo.thumbnail("s"),height:"75px",width:"75px"}),
       $imgLink = $( document.createElement("a") ).addClass("photo").attr({title:photo.title,href:photo.url()}).append( $img );
       $(".photos", view.$el).append($imgLink);
      })
      $(".photos a", view.$el).lightBox({
       imageBtnClose:"/images/lightbox-btn-close.gif",
       imageBtnPrev: "/images/lightbox-btn-prev.gif",
       imageBtnNext: "/images/lightbox-btn-next.gif",
       imageBlank: "/images/lightbox-blank.gif",
       imageLoading: "/wp-content/themes/travel/images/loading.gif"
      });
      $(".photos", view.$el).slider()

    },
    render: function () {
     var view = this,
     loc = this.model,
     $content = $(".content", view.el),
     $locationHTML = $(".location", $content)
     locationPhotos = false, 
     locationHTML = ($locationHTML.length == 1 && $locationHTML.data("id") == loc.id ? $locationHTML.get(0) : false),
     loadingUI = new LoadingUIView({text:locationHTML ? "Loading photos" : "Loading content"})
     $content.empty().addClass("loading").append(loadingUI.render())
     view.showHTML()
     loadingUI.center()
     if( !locationHTML ) {
      $.ajax({
       url:"/wp-admin/admin-ajax.php",
       data:{
        action:"location_html",
        location_id:loc.get("ID")
       },
       success:function (html) {
        locationHTML = html
        loadingUI.setText("Loading photos")
        loadingDone()
       }
      })
     }
     
     loc.photos({
       success:function (photos) {
        locationPhotos = photos
        loadingDone()
       }
     })
     function loadingDone() {  
      if( !locationPhotos || !locationHTML ) { return }
      loadingUI.remove()
      $content.append(locationHTML).removeClass("loading")
      view.showPhotos(locationPhotos) 
     }
    }
   })

   var LoadingUIView = Backbone.View.extend({
     el: document.createElement("div"),
     initialize: function () {
      this.$el.addClass("loading-ui")
      this.setText(this.options.text)
      this.elipsesInterval = null
     },
     startElipsesAnimation: function () {
       var view = this,
       elipsesMin = view.options.elipsesMin || 0,
       numElipses = elipsesMin,
       elipsesLimit = view.options.elipsesLimit || 3
       this.elipsesInterval = setInterval(function () {
         var elipses = ""
         for(var i = 0; i < numElipses; i++) {
           elipses += "." 
         }
         view.$el.text(view.options.text + elipses)
         if(numElipses == elipsesLimit) {
          numElipses = elipsesMin 
         } else {
          numElipses++
         }
       }, 200);
     },
     stopElipsesAnimation: function () {
       clearInterval( this.elipsesInterval )
     },
     remove: function () {
       this.$el.remove()
       this.stopElipsesAnimation()
     },
     setText: function (text) {
       this.options.text = text
       this.$el.text(text)
     },
     render: function () {
       this.startElipsesAnimation() 
       return this.el
     },
     center: function () {
      this.$el.css({margin:this.$el.parents(".loading").height() * .55 + "px auto 0"})
     }
   })
