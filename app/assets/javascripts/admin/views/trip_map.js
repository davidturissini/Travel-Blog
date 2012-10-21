var TripMap = Backbone.View.extend({
	initialize: function () {
		var form = this,
		loc = form.model

		this.locationHash = {}
		this.options.countryCollection = this.options.countryCollection || TA.countries;
		this._bounds = new google.maps.LatLngBounds();
	},
	showLocationString:function(string) {
		if( !this.options.geoElem ) { return }
		this.options.geoElem.innerHTML = string;
	},
	_bindMapClicks: function () {
		var form = this,
		loc = form.model,
		decoder = new GeocodeDecoder();

		google.maps.event.addListener(form.googleMap(), "click", function (mapEvent) {
			decoder.decode(mapEvent.latLng, {
			success:function (result) {
				if( result.data ) {
					form.options.countryCollection.fetch({
						success:function () {
							var country = form.options.countryCollection.findByName(result.data.country);
							if(!country) { return }
							var location = new Location({
								city: result.data.city || "",
								state: result.data.state || "",
								latitude: mapEvent.latLng.lat(),
								longitude: mapEvent.latLng.lng()
							})
							location.setCountry( country );
							new LocationMarker({
					            model:location,
					            map:form.googleMap(),
					            draggable:true
					        }).render();

					        form.model.locations().add(location);
						}
					})
				}
				}
			})
		});

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
	drawMap:function (options) {
		options = options || {};
        var mapOptions = {
            center: new google.maps.LatLng(0,0),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            scrollwheel: false
        }

        for(var x in options) {
            mapOptions[x] = options[x];
        }

        this._googleMap = new google.maps.Map(this.el, mapOptions);
        this.__drawLocations();
	},
	__drawLocations:function () {
		var view = this;
		view.model.locations().each(function (loc) {
			var marker = new LocationMarker({
				model:loc,
				map:view.googleMap()
			}).render();
			view.bounds().union(new google.maps.LatLngBounds(loc.latLng(), loc.latLng()))
		})
		view.googleMap().fitBounds(this._bounds);
	},
	bounds:function () {
		return this._bounds;
	},
	startEdit:function () {
		this._bindMapClicks();
	},
	doneEdit:function () {

	},
	render: function () {
		this.drawMap();
	}
})