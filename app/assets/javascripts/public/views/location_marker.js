var LocationMarker = Backbone.View.extend({
 initialize: function () {
   var loc = this.model,
   locMarker = this
   
   this.googleMarker = new google.maps.Marker()
   if( this.options.draggable ) {
    this.googleMarker.setOptions({draggable:true})
    google.maps.event.addListener(this.googleMarker, "dragend", function (e) {
    loc.set({
      latitude:e.latLng.lat(),
      longitude:e.latLng.lng()
    })
   })
   }
   
   google.maps.event.addListener(this.googleMarker, "click", function () {
    if( locMarker.options.click ) { locMarker.options.click() }
   })
   loc.on("change", function (e, options) {
    if( options.changes.longitude || options.changes.latitude || options.changes.kml_url ) {
     locMarker.render() 
    }
   })
 },
 removeMarker:function () {
  this.googleMarker.setMap(null);
 },
 drawMarker: function () {
  var locMarker = this
  if( this.model.hasLatLng() ) {
    markerHash = {
     position: this.model.latLng(),
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
   return this;
  }
 })