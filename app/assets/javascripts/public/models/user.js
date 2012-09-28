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
  if( !TA.currentUser ) { return false }
  return this.get("id") == TA.currentUser.get("id");
 }
})

User.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var userJson = JSON.parse( node.getAttribute(attributeName) );

    return new User(userJson)
  }