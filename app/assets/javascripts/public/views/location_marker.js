var LocationMarker = Backbone.View.extend({
 initialize: function () {
   var loc = this.model,
   locMarker = this
   
   this.googleMarker = new google.maps.Marker()
   
   google.maps.event.addListener(this.googleMarker, "click", function () {
    if( locMarker.options.click ) { locMarker.options.click() }
      locMarker.trigger("click", {marker:locMarker});
   })

   google.maps.event.addListener(this.googleMarker, "mouseover", function () {
      locMarker.trigger("mouseover", {marker:locMarker});
   })

   loc.on("change", function (e, options) {
    if( options.changes.longitude || options.changes.latitude ) {
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
     map: this.options.map
     }
     this.googleMarker.setOptions(markerHash)
   }
 },
 render: function () {
  var locMarker = this
   this.drawMarker();
   this.model.on("destroy", function () {
      locMarker.googleMarker.setMap(null);
    })
   return this;
  }
 })