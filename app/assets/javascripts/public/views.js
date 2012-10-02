var LocationMarker = Backbone.View.extend({
 initialize: function () {
   var loc = this.model,
   locMarker = this
   
   this.googleMarker = new google.maps.Marker()
   google.maps.event.addListener(this.googleMarker, "click", function () {
    if( locMarker.options.click ) { locMarker.options.click() }
   })
   loc.on("change", function (e, options) {
    if( options.changes.longitude || options.changes.latitude || options.changes.kml_url ) {
     locMarker.render() 
    }
   })
 },
 drawMarker: function () {
  var locMarker = this
  if( this.model.has("latitude") && this.model.has("longitude") ) {
    markerHash = {
     position: new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude")),
     map: this.options.map,
     title: this.model.get("title")
     }
     this.googleMarker.setOptions(markerHash)
   }
 },
 drawKML: function () {
  if( this.model.has("kml_url") ) {
    var view = this,
    kml = new google.maps.KmlLayer(this.model.get("kml_url"), {preserveViewport:true,suppressInfoWindows:true})
    
    kml.setMap(this.options.map)
    google.maps.event.addListener(kml, "defaultviewport_changed", function () {
      var bounds = kml.getDefaultViewport()
      view.options.map.fitBounds(bounds)
      if( !view.model.hasLatLng() ) {
        var marker = new google.maps.Marker({
         position: bounds.getCenter(),
         map: view.options.map,
         title: view.model.get("title")
         })
      }
    })
   }
 },
 render: function () {
  var locMarker = this
   this.drawMarker()
   this.drawKML()
  }
 })

var LocationInfoWindow = Backbone.View.extend({
 initialize: function () {
  this._infoWindow = new google.maps.InfoWindow()
 },
 render: function () {
  var infoWindowHTML = document.createElement("div"),
  locationTitle = document.createElement("a")
  locationTitle.setAttribute("href", this.model.url())
  locationTitle.appendChild(document.createTextNode( this.model.get("title") ) )
  if( this.model.get("photo_url") ) {
   var locationImg = document.createElement("img")
   locationImg.setAttribute("src", this.model.get("photo_url"))
   infoWindowHTML.appendChild(locationImg)
  }
  infoWindowHTML.appendChild(locationTitle)
  this._infoWindow.setPosition(new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude")))
  this._infoWindow.setContent(infoWindowHTML);
  return this
 },
 setLocation: function (location) {
  this.model = location
  return this
 },
 open: function () {
  this._infoWindow.open(this.options.map) 
 }
})

var Scroller = Backbone.View.extend({
 initialize: function () {
  var scroller = this
  scroller.leftPaddle = document.createElement("a")
  scroller.rightPaddle = document.createElement("a")
  scroller.overflowContainer = document.createElement("div")
  scroller.containerWidth = 0
  scroller.viewportWidth = 0
  scroller.index = 0
  scroller.visibleItems = 0
  scroller.paddleWidth = 50

  scroller.el.className += " scroller"
  this.options.container.className += " container"
  scroller.overflowContainer.className = "overflow-container"
 
  scroller.leftPaddle.className += "left paddle"
  scroller.rightPaddle.className += "right paddle"
 
 },
 prev: function () {
  var scroller = this,
  elemLeft = parseInt(scroller.options.container.style.left) || 0,
  left = elemLeft < 0 ? elemLeft * -1 : elemLeft,
  numItems = scroller.options.items.length,
  targetLimit = scroller.index - scroller.visibleItems,
  limit = targetLimit >= 0 ? targetLimit : 0
  for(var i = scroller.index; i > limit; i--) {
   var elem = scroller.options.items.item(i)
   left -= elem.offsetWidth  
  }
  scroller.index = i
  scroller.options.container.style.left = left * -1 + "px"
  scroller.determineVisibleItems()
 },
 next: function () {
  var scroller = this,
  elemLeft = parseInt(scroller.options.container.style.left) || 0,
  left = elemLeft < 0 ? elemLeft * -1 : elemLeft,
  numItems = scroller.options.items.length,
  targetLimit = scroller.index + scroller.visibleItems,
  limit = targetLimit <= numItems - scroller.visibleItems ? targetLimit :  numItems - scroller.visibleItems
  for(var i = scroller.index; i < limit; i++) {
   var elem = scroller.options.items.item(i)
   left += elem.offsetWidth 
  }
  scroller.index = i
  scroller.options.container.style.left = left * -1 + "px"
  scroller.determineVisibleItems()
 },
 determineVisibleItems: function () {
  var scroller = this,
  itemsWidth = 0

  scroller.visibleItems = 0 
  scroller.viewportWidth = scroller.el.offsetWidth - (scroller.paddleWidth * 2)
  for(var i = scroller.index; i < scroller.options.items.length; i++) {
   var elem = scroller.options.items.item(i)
   if( elem.offsetWidth + itemsWidth <= scroller.viewportWidth ) {
    itemsWidth += elem.offsetWidth
    scroller.visibleItems++
   } else {
    continue
   }
  }
  scroller.overflowContainer.style.width = itemsWidth + "px"
  var diff = scroller.el.offsetWidth - (itemsWidth + scroller.paddleWidth * 2)
  scroller.leftPaddle.style.marginLeft = diff / 2 + "px"
  scroller.rightPaddle.style.marginRight = diff / 2 + "px"
 },
 render: function () {
  var scroller = this
 
  scroller.el.innerHTML = ""
  scroller.overflowContainer.appendChild(scroller.options.container)

  var toAppend = []
  if( scroller.options.paddles !== false ) {
    toAppend = toAppend.concat([scroller.leftPaddle, scroller.rightPaddle])
  }
  toAppend.push(scroller.overflowContainer)
  toAppend.forEach(function (elem) {
   scroller.el.appendChild(elem)
  });

  [].forEach.call(scroller.options.items, function (elem) {
   scroller.containerWidth += elem.offsetWidth
  })

  scroller.options.container.style.width = scroller.containerWidth + "px"
  scroller.determineVisibleItems()  

  scroller.leftPaddle.addEventListener("click", function () {
   scroller.prev()
  })
 
  scroller.rightPaddle.addEventListener("click", function () {
   scroller.next()
  })
  
  if( scroller.options.dynamicResize === true ) {
   var resizeTimeout;
   window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout)
    resizetimeout = setTimeout(function () {
     scroller.determineVisibleItems()
    }, 100);
   })
  }
  return scroller
 }
})

var FullScreenLocationGallery = Backbone.View.extend({
  initialize: function () {
    this.el = this.options.gallery.el.cloneNode(true)
    this.el.id = "fullsize-gallery"
    this.el.getElementsByClassName("location-thumbs").item(0).innerHTML = ""
  },
  galleryDelegate: function () {
    var view = this
    return {
      getLargeImageSrc: function(flickrImg) {
        var viewfinder = view.gallery.el,
        figure = view.gallery.largeImage()
        if( viewfinder.offsetWidth > 1024 ) {
          return flickrImg.url("b")
        } else { 
          return flickrImg.url()
        }
      }
    }
  },
  hide: function () {
    document.body.style.overflow = "auto"
    if( this.el.parentNode ) {
      this.el.parentNode.removeChild(this.el)
    }
  },
  render: function () {
    var view = this,
    origGallery = this.options.gallery

    document.body.style.overflow = "hidden"
    document.body.appendChild(this.el)

    view.gallery = new LocationGallery({
      el:view.el,
      model:this.options.gallery.model,
      delegate:view.galleryDelegate()
    }).render()

    var close = document.createElement("a")
    close.className = "close"
    close.appendChild(document.createTextNode("x"))
    view.gallery.el.appendChild(close)

    close.addEventListener("click", function () {
      view.hide()
    })

    document.addEventListener("keyup", function (e) {
      switch(e.keyCode) {
        case 27:
          view.hide()
          break;
      }
    })
    
  }
})

var LocationGallery = Backbone.View.extend({
  __defaultDelegates: function () {
    return {
      getLargeImageSrc:function (flickrImg) {
        return flickrImg.url()
      }
    }
  },
  initialize: function () {
    var userOptions = this.options.delegate
    this.options.delegate = this.__defaultDelegates()

    if( userOptions ) {
      for(var x in userOptions ) {
        this.options.delegate[x] = userOptions[x]
      }
    }
  },
  largeImage: function () {
    var className = this.largeImageClassName()
    return this.el.getElementsByClassName(className).item(0)
  },
  largeImageClassName: function () {
    return "hero-large"
  },
  handleTextDisplay: function () {
    var figCaption = this.largeImage().getElementsByTagName("figcaption").item(0)
    if( figCaption ) {
      setTimeout(function () {
        figCaption.className += " idle"
      }, 2000)
    }
  },
  emptyThumbnails: function () {
    this.el.getElementsByClassName("location-thumbs").item(0).innerHTML = ""
  },
  setLargeImage: function (thumbFigure, flickrImg) {
    var clone = thumbFigure.cloneNode(true),
    className = this.largeImageClassName(),
    cloneImg = clone.getElementsByTagName("img").item(0)
    clone.className += className
    cloneImg.setAttribute("src", this.options.delegate.getLargeImageSrc(flickrImg))
    this.el.replaceChild(clone, this.largeImage())
    this.handleTextDisplay()
  },
  render: function () {
    var loc = this.model,
    view = this
    loc.photos({
      success:function (e) {
       var thumbContainer = view.el.getElementsByClassName("location-photos").item(0),
       thumbUl = view.el.getElementsByClassName("location-thumbs").item(0)
       e.photoset.photo.forEach(function (photo) {
        var image = new FlickrImage(photo),
        li = document.createElement("li"),
        img = document.createElement("img"),
        thumbFigure = document.createElement("figure"),
        thumbCaption = document.createElement("figcaption")
        ulWidth = thumbUl.offsetWidth
        img.setAttribute("src", image.url("s"))
        thumbFigure.appendChild(img)
        if( image.get("title") ) {
          thumbCaption.appendChild( document.createTextNode(image.get("title")) )
          thumbFigure.appendChild(thumbCaption)
        }

        li.appendChild(thumbFigure)
        thumbUl.appendChild(li)
        thumbUl.style.width = ulWidth + li.offsetLeft + "px"
        thumbFigure.addEventListener("click", function () {
          view.setLargeImage(thumbFigure, image)
        }) 
       })

       view.thumbnailScroller = new Scroller({
        el:thumbContainer,
        container:thumbUl,
        items:view.el.getElementsByClassName("location-thumbs").item(0).getElementsByTagName("li"),
        dynamicResize: true
       }).render()
       
      }
   })

   return this 
  }
})

