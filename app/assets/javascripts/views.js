var LocationMarker = Backbone.View.extend({
 render: function () {
  var locMarker = this,
  iconUrl = this.model.get("has_visited") ? this.options.locationType.get("icon_url") : this.options.locationType.get("icon_not_visited_url")
  markerHash = {
   position: new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude")),
   map: this.options.map,
   title: this.model.get("title"),
   icon: iconUrl
   },
   marker = new google.maps.Marker(markerHash)     
   google.maps.event.addListener(marker, "click", function () {
    if( locMarker.options.click ) { locMarker.options.click() }
   })
  }
 })

var LocationInfoWindow = Backbone.View.extend({
 initialize: function () {
  this._infoWindow = new google.maps.InfoWindow()
 },
 render: function () {
  var infoWindowHTML = document.createElement("div"),
  locationTitle = document.createElement("header")
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
