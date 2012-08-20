var CountryField = Backbone.View.extend({
	initialize: function () {
		var field = this,
		options = this.el.querySelectorAll("datalist option")
		countryJson = [];

		field.span = field.el.querySelector("span");

		[].forEach.call(options, function (option) {
			var json = JSON.parse( option.getAttribute("data-json") )
			countryJson.push(json)
		})

		field.collection = new CountryCollection(countryJson)

		field.model.on("change", function (model, options) {
			var countryName = ""
		    if( options.changes.country_id ) {
				var country = field.collection.get(field.model.get("country_id"))
				if( country ) {
					countryName = country.get("name")
					field.span.innerHTML = countryName
				}  else {
					field.span.innerHTML = ""
				}
				

		    }
	    })
	}
})