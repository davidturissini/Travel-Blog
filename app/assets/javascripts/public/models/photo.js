var Photo = Backbone.Model.extend({
	initialize:function (attributes) {
		if( attributes.constructor === File ) {
			this.raw = attributes;
		}
	}
})