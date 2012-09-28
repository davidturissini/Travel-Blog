var Location = Backbone.Model.extend({
 url: function () {
  var str = "/" + this.user.get("slug") + "/" + this.locationType.get("slug")
  if( this.id ) { str += "/" + this.get("slug") }
  return str
 },
 jsonPrefix: false,
 toJSON: function () {
   if( this.jsonPrefix ) {
    return {location:this.attributes}
   } else {
    return this.attributes 
   }
 },
 setUser: function (user) {
  this.user = user
 },
 setLocationType: function (locType) {
  this.locationType = locType
  this.setUser(locType.user)
 },
 hasLatLng: function () {
  return this.has("latitude") && this.has("longitude")
 },
 photos: function ( callbacks ) {
  callbacks = callbacks || {}
  if( this._flickrResponse ) {
    callbacks.success(_flickrResponse);
  } else {
    $.ajax({
     url:"http://api.flickr.com/services/rest",
     dataType:"jsonp",
     data: {
      api_key:"951c0814caade8b4fc2b381778269126",
      method: "flickr.photosets.getPhotos",
      format:"json",
      photoset_id: this.get("flickr_set")
     },
     jsonpCallback:"jsonFlickrApi",
     success:function (e) {
      if( callbacks.success ) { callbacks.success(e); }
     }
    })
  }
 }
})