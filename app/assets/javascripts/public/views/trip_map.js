var TripMap = Backbone.View.extend({
	initialize: function () {
		var form = this,
		loc = form.model

		this.locationHash = {}
		this.options.countryCollection = this.options.countryCollection || TA.countries;
		this._bounds = new google.maps.LatLngBounds();

		this.setMapOptions({
            center: new google.maps.LatLng(40.7142, -74.0064),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            scrollwheel: false
        });
	},
	showLocationString:function(string) {
		if( !this.options.geoElem ) { return }
		this.options.geoElem.innerHTML = string;
	},
	drawMapMarker: function () {
		this.markerClone.render();
	},
	googleMapMarker:function () {
        return this._googleMapMarker;
    },
    googleMap:function () {
        return this._googleMap;
    },
    mergeMapOptions:function (options) {
    	for(var x in options) {
    		this.mapOptions()[x] = options[x];
    	}
    	return this;
    },
    setMapOptions:function (options) {
    	this._mapOptions = options;
    },
    mapOptions:function () {
    	return this._mapOptions;
    },
	drawMap:function () {
        this._googleMap = new google.maps.Map(this.el, this.mapOptions());
        this.__drawLocations();
	},
	__drawLocations:function () {
		var view = this;
		view.markers = [];
			view.model.locations().each(function (loc) {
				var marker = new LocationMarker({
					model:loc,
					map:view.googleMap()
				}).render();
				view.bounds().union(new google.maps.LatLngBounds(loc.latLng(), loc.latLng()))
				view.markers.push(marker);
			})

		if( view.model.locations().length > 1 ) {
			view.googleMap().fitBounds(this._bounds);
		} else if (view.model.locations().length > 0 ) {
			view.googleMap().setCenter( view.model.locations().first().latLng() );
			view.googleMap().setZoom(10);
		}
	},
	bounds:function () {
		return this._bounds;
	},
	render: function() {
		this.drawMap();
	}
})