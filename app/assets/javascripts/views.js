var LocationMarker = Backbone.View.extend({
 initialize: function () {
   var loc = this.model,
   locMarker = this
   this.icon_url = this.model.get("has_visited") ? this.options.locationType.get("icon_url") : this.options.locationType.get("icon_not_visited_url")
   this.googleMarker = new google.maps.Marker()
   google.maps.event.addListener(this.googleMarker, "click", function () {
    if( locMarker.options.click ) { locMarker.options.click() }
   })
   loc.on("change", function (e, options) {
    if( options.changes.longitude || options.changes.latitude ) { 
     locMarker.render() 
    }
   })
 },
 render: function () {
  var locMarker = this
  markerHash = {
   position: new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude")),
   map: this.options.map,
   title: this.model.get("title"),
   icon: locMarker.iconUrl
   }
   this.googleMarker.setOptions(markerHash)
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
  var diff = (scroller.el.offsetWidth - itemsWidth) / 2
  scroller.leftPaddle.style.width = diff + "px"
  scroller.rightPaddle.style.width = diff + "px"
 },
 render: function () {
  var scroller = this
 
  scroller.el.innerHTML = ""
  scroller.overflowContainer.appendChild(scroller.options.container)
  var toAppend = [scroller.leftPaddle, scroller.rightPaddle, scroller.overflowContainer]
  toAppend.forEach(function (elem) {
   scroller.el.appendChild(elem)
  });

  scroller.leftPaddle.style.width = scroller.paddleWidth + "px"
  scroller.rightPaddle.style.width = scroller.paddleWidth + "px";
  
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
  
  var resizeTimeout;
  window.addEventListener("resize", function () {
   clearTimeout(resizeTimeout)
   resizetimeout = setTimeout(function () {
    scroller.determineVisibleItems()
   }, 500);
  })
  return scroller
 }
})

