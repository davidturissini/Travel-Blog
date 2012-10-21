var TripPhotosCollection = Backbone.Collection.extend({
	model:Photo,
	initialize:function (options) {
		if( options.location ) {
			this.trip = options.trip;
		}
	},
	url:function () {
		return this.trip.url() + "/photos";
	}
})