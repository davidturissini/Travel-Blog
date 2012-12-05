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

