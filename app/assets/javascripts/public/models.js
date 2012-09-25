var MissingUserException = function ( message ) {
 this.message = message
 }

var LocationType = Backbone.Model.extend({
 url: function () {
  if( !this.isNew() ) {
   return this.user.url() + "/" + this.get("slug")
  } else {
   return this.user.url() + "/location_types"
  }
 },
 jsonPrefix: false,
 toJSON: function () {
   if( this.jsonPrefix ) {
    return {location_type:this.attributes}
   } else {
    return this.attributes 
   }
 },
 initialize: function () {
  if( this.has("user") ) {
   var user = this.get("user")
   this.setUser(user, {silent:true})
  }
  this.validate(this.attributes)
 },
 setUser: function (user, options) {
  options = options || {}
  var user_id = user.id
  this.set({user_id:user_id}, options)
  delete this.attributes.user
  this.user = user
 },
 validate: function ( options ) {
  if( !options.user_id ) {
   throw new MissingUserException("User need to be specified") 
  } 
 } 
 })

var User = Backbone.Model.extend({
 jsonPrefix: false,
 toJSON: function () {
  if( this.jsonPrefix ) {
    return { user: this.attributes}
  } else {
    return this.attributes
  }
 },
 latLng: function () {
  return new google.maps.LatLng(user.get("latitude"), user.get("longitude"))
 },
 url: function (e) {
  if( this.isCurrentUser() ) {
    return "/me?format=json"
  }
  return "/" + this.get("slug")
 } ,
 isCurrentUser:function () {
  return this.get("id") == TA.currentUser.get("id");
 }
})

User.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var userJson = JSON.parse( node.getAttribute(attributeName) );

    return new User(userJson)
  }

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

var FlickrImage = Backbone.Model.extend({
 url: function (size) {
  size = size ? "_" + size : ""
  return "http://farm" + this.get("farm") + ".static.flickr.com/" + this.get("server") + "/" + this.get("id") + "_" + this.get("secret") + size + ".jpg"
 } 
})

var Country = Backbone.Model.extend({
  
})
