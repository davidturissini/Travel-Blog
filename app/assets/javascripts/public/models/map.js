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
	createWithXML:function (callbacks) {
		callbacks = callbacks || {};
		var map = this,
		formData = new FormData();
		formData.append("map[xml]", this.file);

		for(var x in map.attributes) {
			formData.append("map[" + x + "]", map.attributes[x]);
		}

		var xhr = new XMLHttpRequest();
        xhr.open('POST', map.url());
        xhr.onload = function (e) {
          if (xhr.status === 200) {
            if( callbacks.success ) {
            	var json = JSON.parse( e.currentTarget.responseText );
            	map.set(json);
				callbacks.success(json);
				}
          	}
        };

        xhr.send(formData);
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
	url:function () {
		if( this.isNew() ) {
			return this.trip().url() + "/maps/";
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