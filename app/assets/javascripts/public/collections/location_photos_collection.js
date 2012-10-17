var LocationPhotosCollection = Backbone.Collection.extend({
	model:Photo,
	initialize:function (options) {
		if( options.location ) {
			this.location = options.location;
		}
	},
	url:function () {
		return this.location.url() + "/photos";
	}
})