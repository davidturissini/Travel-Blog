var MissingUserException = function ( message ) {
 this.message = message
 }


var LocationType = Backbone.Model.extend({
 url: function () {
  if( !this.isNew() ) {
   return "/" + this.user.get("slug") + "/" + this.get("slug")
  } else {
   return "/" + this.user.get("slug") + "/location_types"
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