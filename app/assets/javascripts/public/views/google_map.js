var GoogleMap = Backbone.View.extend((function () {

	var _googleMap, _markers = [],
	_bounds = new google.maps.LatLngBounds(),
	_locations = new LocationsCollection(),
	_maps = new MapsCollection();

	return {
		initialize:function () {
			var view = this;

			this.setMapOptions({
	            center: new google.maps.LatLng(40.7142, -74.0064),
	            zoom: 4,
	            mapTypeId: google.maps.MapTypeId.HYBRID,
	            scrollwheel: false
	        });

	        _locations.on("add", function (location) {
	        	view.drawLocation(location);
	        });

	        _maps.on("add", function (map) {
	        	view.drawMap(map);
	        })
		},
	    setMapOptions:function (options) {
	    	this._mapOptions = options;
	    },
	    mapOptions:function () {
	    	return this._mapOptions;
	    },
	    addLocations:function (locations, options) {
	    	options = options || {};
	    	locations.each(function (location) {
	    		_locations.add(location, options);
	    	})
	    },
		setMaps:function (maps) {
			_maps = maps;
		},
	    setLocations:function (locations) {
	    	_locations = locations;
	    },
	    maps:function () {
	    	return _maps;
	    },
	    addMaps:function (maps) {
	    	maps.each(function (map) {
	    		_maps.add(map);
	    	})
	    },
	    drawMap:function (map) {
	    	var view = this,
	    	numLoaded = 0,
	    	kml = new google.maps.KmlLayer(map.staticUrl(), {
				preserveViewport: true
			});
			google.maps.event.addListener(kml, "defaultviewport_changed", function () {
				var _bounds = view.bounds().union(kml.getDefaultViewport());
				view.googleMap().fitBounds(_bounds);
			});
			
			kml.setMap(this.googleMap());
	    },
	    drawLocation:function (loc) {
	    	var view = this,
	    	marker = new LocationMarker({
				model:loc,
				map:this.googleMap()
			}).render();

    		if( _locations.length > 1 ) {
				var bounds = new google.maps.LatLngBounds(loc.latLng()),
				_bounds = view.bounds().union(bounds);
				view.googleMap().fitBounds(_bounds);
			} else if ( _locations.length === 1 ) {
				view.googleMap().setCenter( _locations.first().latLng() );
				view.googleMap().setZoom(10);
			}

			marker.on("click", function (evt) {
				view.trigger("location_click", evt);
			})

			marker.on("mouseover", function (evt) {
				view.trigger("location_mouseover", evt);
			})

			_markers.push(marker);
	    },
	    drawMaps:function (maps) {
			var view = this;
			maps = maps || _maps;

			maps.each(function (map) {
				view.drawMap(map);
			});

			return this;
		},
		drawLocations:function () {
			var view = this;
			view.markers = [];
			_locations.each(function (loc) {
				view.drawLocation(loc);
			})

			return this;
		},
	    mergeMapOptions:function (options) {
	    	for(var x in options) {
	    		this.mapOptions()[x] = options[x];
	    	}
	    	return this;
	    },
		googleMap:function () {
			return _googleMap;
		},
		drawGoogleMap:function () {
	        _googleMap = new google.maps.Map(this.el, this.mapOptions());
		},
		bounds: function () {
			return _bounds;
		},
		render: function () {
			this.drawGoogleMap();
			return this;
		}
	}
})())