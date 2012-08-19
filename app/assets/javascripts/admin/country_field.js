var CountryField = Backbone.View.extend({
	initialize: function () {
		var field = this,
		countryName = ""

		field.model.on("change", function (model, options) {
		    if( options.changes.country_id ) {
		    	
				var country = field.collection.get(field.model.get("country_id"))
				if( country ) {
					countryName = country.get("name")
				}

				field.options.textElem.innerHTML = countryName
				field._updateFormField()

		    }
	    })
	},
	_updateFormField:function () {
      	var model = this.model,
		newVal = model.get("country_id"),
		elem = this.options.input
		if( elem.value != newVal) {
		  elem.value = newVal
		}
   	}
})