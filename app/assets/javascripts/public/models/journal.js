var Journal = Backbone.Model.extend({
	setTrip:function (trip) {
		this._trip = trip;
		this.set({trip_id:trip.id});
	},
	trip:function () {
		return this._trip;
	}
})

Journal.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var json = JSON.parse( node.getAttribute(attributeName) );

    return new Journal(json)
}