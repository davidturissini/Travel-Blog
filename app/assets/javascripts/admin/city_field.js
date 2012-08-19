var CityField = Backbone.View.extend({
	initialize: function () {
		var field = this,
		model = field.model

		model.on("change", function (e, options) {
	        if( options.changes.city ) {
	        	field._updateFormField()
	        } 
	    })

	    field.options.input.addEventListener("change", function (e) {
	       model.set("city", e.currentTarget.value)
	    })
	},
	_updateFormField:function () {
      	var model = this.model,
		newVal = model.get("city"),
		elem = this.options.input
		if( elem.value != newVal) {
		  elem.value = newVal
		}
   	}
})