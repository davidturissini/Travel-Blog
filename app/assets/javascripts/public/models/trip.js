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
	setPhoto:function (photo) {
		this._photo = photo;
        this.set({photo_id:photo.id});
	},
	photo:function () {
		return this._photo;
	},
	photos:function (options) {
        var trip = this;
        options = options || {};
        this._photos = this._photos || new TripPhotosCollection({trip:this});
        this._photos.fetch({
            success:function (photos) {
                photos.each(function (photo) {
                    photo.setUser(trip.user);
                })
                if( options.success ) {
                    options.success(photos);
                }
            }
        })
    },
	setLocations:function(locations) {
		this._locations = locations;
	},
	editPhotosUrl:function () {
		return this.url() + "/photos/edit";
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