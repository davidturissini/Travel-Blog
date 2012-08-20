var CountryField = Backbone.View.extend({
	initialize: function () {
		var field = this,
		options = this.el.querySelectorAll("datalist option")
		countryJson = [];

		field.input = field.el.querySelector("input");

		[].forEach.call(options, function (option) {
			var json = JSON.parse( option.getAttribute("data-json") )
			countryJson.push(json)
		})

		field.collection = new CountryCollection(countryJson)
		field.input.addEventListener("change", function (e) {
			var countryName = e.currentTarget.value,
			country = field.collection.findByName(countryName)
			if( country ) {
				field.model.set({
					country_id:country.id
				})
			} else {
				field.input.value = ""
			}
		})

		field.model.on("change", function (model, options) {
			var countryName = ""
		    if( options.changes.country_id ) {
				var country = field.collection.get(field.model.get("country_id"))
				if( country ) {
					countryName = country.get("name")
					field.input.value = countryName
				}  else {
					field.input.value = ""
				}
				

		    }
	    })
	}
})