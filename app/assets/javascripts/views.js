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
