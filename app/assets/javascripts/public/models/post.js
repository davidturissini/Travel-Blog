var Post = Backbone.Model.extend({
	setTrip:function (trip) {
		this._trip = trip;
		this.set({trip_id:trip.id});
	},
	trip:function () {
		return this._trip;
	},
	setUser:function (user) {
		this._user = user;
	},
	user:function () {
		return this._user;
	}
})

Post.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var json = JSON.parse( node.getAttribute(attributeName) );

    return new Post(json)
}