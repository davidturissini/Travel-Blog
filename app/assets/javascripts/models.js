var MissingUserException = function ( message ) {
 this.message = message
 }

var LocationType = Backbone.Model.extend({
 url: function () {
  return this.user.url() + "/" + this.get("slug")
 },
 initialize: function () {
  if( this.has("user") ) {
   var user = this.get("user"),
   user_id = user.id
   this.set({user_id:user_id, user:null}, {silent:true})
   this.user = user
  }
  this.validate(this.attributes)
 },
 validate: function ( options ) {
  if( !options.user_id ) {
   throw new MissingUserException("User need to be specified") 
  } 
 } 
 })

var User = Backbone.Model.extend({
 url: function () {
  return "/" + this.get("slug")
 } 
})

var Location = Backbone.Model.extend({
 url: function () {
  var str = "/" + this.user.get("slug") + "/" + this.locationType.get("slug")
  if( this.id ) { str += "/" + this.id }
  return str
 },
 setUser: function (user) {
  this.user = user
 },
 setLocationType: function (locType) {
  this.locationType = locType
 },
 photos: function ( callbacks ) {
  callbacks = callbacks || {}
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
})









