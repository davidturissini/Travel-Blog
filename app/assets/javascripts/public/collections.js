var LocationTypeCollection = Backbone.Collection.extend({
 initialize: function (options) {
  if( options.user ) { this.user = options.user } 
 },
 format:"json",
 model:LocationType,
 url: function () {
  return "/" + this.user.get("slug") + "/location_types?format=" + this.format
 }
})

var LocationCollection = Backbone.Collection.extend({
 initialize: function (options) {
  if( options.user ) { this.user = options.user } 
 },
 format:"json",
 model:Location,
 url: function () {
  return "/" + this.user.get("slug") + "/locations?format=" + this.format
 }
})
