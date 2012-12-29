var User = Backbone.Model.extend((function () {

	var trips;

	return {
		initialize:function (attributes) {
			this.set({name:attributes.name.replace("+", " ")});
		},
		jsonPrefix: false,
		toJSON: function () {
			if( this.jsonPrefix ) {
			return { user: this.attributes }
			} else {
			return this.attributes
			}
		},
		fetchTrips:function (callbacks) {
			callbacks = callbacks || {};
			$.ajax({
				url:this.url() + "/trips",
				success:function (e) {
					if( callbacks.success ) {
						callbacks.success(e);
					}
				}
			})
		},
		trips:function () {
			return _trips;
		},
		setTrips:function (trips) { 
			var user = this;
			_trips = trips;
			_trips.each(function (trip) {
				trip.setUser(user);
			})
		},
		latLng: function () {
			return new google.maps.LatLng(user.get("latitude"), user.get("longitude"))
		},
		staticPath:function () {
			return "http://" + TA.config.static.domain + "/" + TA.config.static.user_path + this.get("slug") + "/";
		},
		url: function (e) {
			return "/" + this.get("slug");
		} ,
		isCurrentUser:function () {
			if( !TA.currentUser ) { return false }
			return this.get("id") == TA.currentUser.get("id");
		},
		isAnonymous:function () {
			return this.get("token") == "anonymous";
		},
		flickrset_photos:function (photosetID, callbacks) {
			callbacks = callbacks || {};
			$.ajax({
				url:this.url({includeFormat:false}) + "/flickr_photoset_photos/" + photosetID,
				jsonpCallback:"jsonFlickrApi",
				success:function (e) {
					if( callbacks.success ) {
						callbacks.success(e);
						}
					}
				})
			}
		}
})())

User.validateSlug = function(slug, callbacks) {
	$.ajax({
		url:"/users/validate_slug",
		data:{slug:slug},
		success:function (e) {
			if( callbacks.success ) {
				callbacks.success(e);
				}
			}
		})
}

User.createFromDataAttribute = function (node, attributeName) {
	attributeName = attributeName || "data-json";
	var userJson = JSON.parse( node.getAttribute(attributeName) );

	return new User(userJson)
  }