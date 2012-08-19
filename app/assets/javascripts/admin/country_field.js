var CountryField = Backbone.View.extend({
	initialize: function () {
		var field = this

		field.model.on("change", function (model, options) {
		    if( options.changes.country_id ) {

			    var country = field.collection.get(field.model.get("country_id"))
			    field.options.textElem.innerHTML = country.get("name")
			    field._updateFormField()

		    }
	    })
	},
	_updateFormField:function () {
      	var model = this.model,
		newVal = model.get("location_id"),
		elem = this.options.input
		if( elem.value != newVal) {
		  elem.value = newVal
		}
   	}
})