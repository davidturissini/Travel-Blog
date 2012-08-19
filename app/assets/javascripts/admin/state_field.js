var StateField = Backbone.View.extend({
	initialize: function () {
		var field = this,
		model = field.model

		model.on("change", function (e, options) {
	        if( options.changes.state ) {
	        	field._updateFormField()
	        } 
	    })

	    field.options.input.addEventListener("change", function (e) {
	       model.set("state", e.currentTarget.value)
	    })
	},
	_updateFormField:function () {
      	var model = this.model,
		newVal = model.get("state"),
		elem = this.options.input
		if( elem.value != newVal) {
		  elem.value = newVal
		}
   	}
})