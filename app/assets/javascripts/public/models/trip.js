var Trip = Backbone.Model.extend({
	initialize: function () {
		this._locations = new LocationsCollection();
	},
	saveWithLocations:function (callbacks) {
		callbacks = callbacks || {};
		this.set({locations:this._locations.models});
		this.save({}, {
			success:function(e){
				if(callbacks.success) {
					callbacks.success(e);
				}
			}
		})
	},
	setLocations:function(locations) {
		this._locations = locations;
	},
	editUrl:function () {
		return this.user().url({includeFormat:false}) + "/" + this.get("slug");
	},
	url:function () {
		if( this.isNew() ) {
			return this.user().url({includeFormat:false}) + "/trips";
		} else {
			return this.user().url({includeFormat:false}) + "/" + this.get("slug");
		}
	},
	user:function () {
		return this._user;
	},
	setUser:function (user) {
		this.set({user_id:user});
		this._user = user;
	},
	setLocations:function (locations) {
		this._locations = locations;
	},
	locations:function () {
		return this._locations;
	},
	mapsUrl:function () {
		return this.url() + "/maps";
	}
})

Trip.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var json = JSON.parse( node.getAttribute(attributeName) );

    return new Trip(json)
}