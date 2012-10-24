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
