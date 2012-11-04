var GoogleMap = Backbone.View.extend((function () {

	var _markers = [];

	return {

		initialize:function () {
			var view = this;

			this.setMapOptions({
	            center: new google.maps.LatLng(40.7142, -74.0064),
	            zoom: 4,
	            mapTypeId: google.maps.MapTypeId.HYBRID,
	            scrollwheel: false
	        });

	        this._locations.on("add", function (location) {
	        	view.drawLocation(location);
	        });

	        this._maps.on("add", function (map) {
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
	    	var view = this;
	    	locations.each(function (location) {
	    		view._locations.add(location, options);
	    	})
	    },
		setMaps:function (maps) {
			this._maps = maps;
		},
	    setLocations:function (locations) {
	    	this._locations = locations;
	    },
	    _locations: new LocationsCollection(),
		_maps: new MapsCollection(),
	    maps:function () {
	    	return this._maps;
	    },
	    addMaps:function (maps) {
	    	var view = this;
	    	maps.each(function (map) {
	    		view._maps.add(map);
	    	})
	    },
	    drawMap:function (map) {
	    	var view = this,
	    	numLoaded = 0,
	    	kml = new google.maps.KmlLayer(map.staticUrl(), {
				preserveViewport: true
			});
			google.maps.event.addListener(kml, "defaultviewport_changed", function () {
				view.unionBounds(kml.getDefaultViewport());
				view.googleMap().fitBounds(view.bounds());
			});
			
			kml.setMap(this.googleMap());
	    },
	    drawLocation:function (loc) {
	    	var view = this,
	    	marker = new LocationMarker({
				model:loc,
				map:this.googleMap()
			}).render();

    		if( view._locations.length > 1 ) {
				view.unionBounds(new google.maps.LatLngBounds(loc.latLng()));
				view.googleMap().fitBounds(view.bounds());
			} else if ( view._locations.length === 1 ) {
				view.googleMap().setCenter( view._locations.first().latLng() );
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
			maps = maps || this._maps;

			maps.each(function (map) {
				view.drawMap(map);
			});

			return this;
		},
		drawLocations:function () {
			var view = this;
			view.markers = [];
			view._locations.each(function (loc) {
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
	    _googleMap:null,
		googleMap:function () {
			return this._googleMap;
		},
		drawGoogleMap:function () {
	        this._googleMap = new google.maps.Map(this.el, this.mapOptions());
		},
		_bounds: new google.maps.LatLngBounds(),
		bounds: function () {
			return this._bounds;
		},
		unionBounds:function (bounds) {
			this._bounds = this.bounds().union(bounds);
		},
		render: function () {
			this.drawGoogleMap();
			return this;
		}
	}
})())