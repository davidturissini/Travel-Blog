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

var CountryCollection = Backbone.Collection.extend({
	model:Country,
	url:"/countries?format=json",
	findByName: function (name) {
		if( name == "" ) {
			return  
		}
		var country = this.where({name:name})[0]
		if( !country ) {
			country = this.filter(function (c) {
				return new RegExp(name).test(c.get("name"))
			})[0]
		}
		return country
	}
})
