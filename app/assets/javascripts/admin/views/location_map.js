var LocationMap = Backbone.View.extend({
	initialize: function () {
		var form = this,
		loc = form.model

		this.locationHash = {}
		this.options.countryCollection = this.options.countryCollection || TA.countries;
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
							form.model.set({
								city: result.data.city || "",
								state: result.data.state || "",
								latitude: mapEvent.latLng.lat(),
								longitude: mapEvent.latLng.lng()
							})
							form.model.setCountry( country );
							form.showLocationString( form.model.geoString({includeTitle:false}) );
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
    drawToMap:function (elem, options) {
        options = options || {};
        var mapOptions = {
            center: this.model.latLng(),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            scrollwheel: false
        }

        for(var x in options) {
            mapOptions[x] = options[x];
        }

        this._googleMap = new google.maps.Map(elem, mapOptions);
        this._googleMapMarker = new LocationMarker({
            model:this.model,
            map:this._googleMap
        })
    },
	drawMap:function (options) {
		options = options || {};
        var mapOptions = {
            center: this.model.latLng(),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            scrollwheel: false
        }

        for(var x in options) {
            mapOptions[x] = options[x];
        }

        this._googleMap = new google.maps.Map(this.el, mapOptions);
        this._googleMapMarker = new LocationMarker({
            model:this.model,
            map:this._googleMap
        }).render();
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