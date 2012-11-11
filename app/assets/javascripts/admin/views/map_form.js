var MapForm = Backbone.View.extend({
	render:function () {
		var view = this;
		[].forEach.call(this.el.getElementsByTagName("textarea"), function (elem) {
			new AutoSaveTextField({
		        model:view.model,
		        el:elem,
		        property:elem.getAttribute("data-property")
		    }).render();

		    new DynamicTextarea({
		    	el:elem
		    }).render();
		});

		new DateField({
	        el:view.el.getElementsByClassName("map-date").item(0),
	        model:view.model,
	        autoUpdate:true
	    }).render();

	    this.el.getElementsByClassName("delete").item(0).addEventListener("click", function () {
	    	if( confirm("Delete map?") ) {
	    		view.model.destroy()
	    	}
	    })

		return this;
	}
})