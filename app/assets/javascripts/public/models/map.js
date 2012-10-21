var Map = Backbone.Model.extend({
	attachFile:function (file) {
		this.file = file;
	},
	staticUrl:function () {
		if( this.isNew() && this.file ) {
	    	window.URL = window.URL || window.webkitURL;
 			return window.URL.createObjectURL(this.file)
		} else if ( !this.isNew() ) {
			return this.user().staticPath() + "maps/" + this.get("slug") + ".kml"
		}
	},
	readFile:function (callbacks) {
		if( !this.file ) { return }
		callbacks = callbacks || {};
		var map = this,
		reader = new FileReader();

		reader.onloadend = function (e) {
			if( callbacks.success ) {
				callbacks.success(e.target.result);
			}
		}

		reader.readAsText(this.file);
	},
	setUser:function (user) {
		this.set({user_id:user.id});
		this._user = user;
	},
	user:function () {
		return this._user;
	},
	setTrip:function (trip) {
		this._trip = trip;
		this.setUser(this._trip.user());
	},
	trip:function () {
		return this._trip;
	},
	stageXML:function (callbacks) {
		callbacks = callbacks || {};
		var map = this;
		this.readFile({
			success:function (fileData) {
				var attributes = map.attributes;
				attributes.xml = fileData;
				$.ajax({
					url:map.stageUrl(),
					type:"POST",
					data:{map:attributes},
					success:function (e) {
						map.set(e, {silent:true});
						if( callbacks.success ) {
							callbacks.success(e);
						}
					}
				})
			}
		})
	},
	drawGoogleMap:function (elem, options) {
		options = options || {};
	 	var mapOptions = {
	        center: new google.maps.LatLng(0,0),
	        zoom: 2,
	        mapTypeId: google.maps.MapTypeId.HYBRID,
	        scrollwheel: false
    	}

    	for(var x in options) {
    		mapOptions[x] = options[x];
    	}

		this.setGoogleMap(new google.maps.Map(elem, mapOptions));

		if( this.get("slug") ) {
			var geo = new google.maps.KmlLayer( this.staticUrl() );
    		geo.setMap(this.googleMap());
		}
	},
	setGoogleMap:function (map) {
		this._googleMap = map;
	},
	googleMap:function () {
		return this._googleMap;
	},
	saveWithXML:function (callbacks) {
		callbacks = callbacks || {};
		var map = this;
		this.readFile({
			success:function (fileData) {
				var oldUrlFunction = map.url;
				map.set({xml:fileData}, {silent:true});
				map.save({},{
					success:function (e) {
						map.unset("xml", {silent:true});
						if( callbacks.success ) {
							callbacks.success(e);
						}
					}
				});
			}
		})
	},
	stageUrl:function() {
		return this.user().url({includeFormat:false}) + "/maps/stage/"
	},
	url:function () {
		if( this.isNew() ) {
			return this.trip().url() + "/maps/create";
		} else {
			return this.trip().url() + "/maps/" + this.get("slug");
		}
	}
})

Map.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var json = JSON.parse( node.getAttribute(attributeName) );

    return new Map(json)
}