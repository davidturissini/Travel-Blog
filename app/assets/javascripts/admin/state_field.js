var StateField = Backbone.View.extend({
	initialize: function () {
		var field = this,
		model = field.model

		model.on("change", function (e, options) {
	        if( options.changes.state ) {
	        	field._updateFormField()
	        } 
	    })
	},
	_updateFormField:function () {
      	var model = this.model,
		newVal = model.get("state"),
		elem = this.options.input
		if( elem.value != newVal) {
		  elem.innerHTML = newVal
		}
   	}
})