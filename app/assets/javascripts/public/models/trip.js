var Trip = Backbone.Model.extend({
	initialize: function () {
		this._locations = new LocationsCollection();
	},
	validate:function (attributes) {
		if( !attributes.title ) {
			return {title:true};
		}
	},
	saveWithLocations:function (callbacks) {
		callbacks = callbacks || {};
		this.set({locations:this._locations.models});
		if( !this.isValid() ) { return }
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

	_photos: null,
	photos:function (options) {
        var trip = this;
        options = options || {};

        if (this._photos === null) {
	        this._photos = new TripPhotosCollection({trip:this});
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
	    }

        return this._photos;
    },
	setLocations:function(locations) {
		var trip = this;
		this._locations = locations;
		this._locations.each(function (loc) {
			loc.setTrip(trip);
		});
	},
	editPhotosUrl:function () {
		return this.url() + "/photos";
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
	locations:function () {
		return this._locations;
	},
	mapsUrl:function () {
		return this.url() + "/maps";
	},
	setMaps:function (maps) {
		var trip = this;
		maps.each(function (map) {
			map.setUser(trip.user());
		})
		this._maps = maps;
	},
	maps:function () {
		return this._maps;
	}
})

Trip.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var json = JSON.parse( node.getAttribute(attributeName) );

    return new Trip(json)
}