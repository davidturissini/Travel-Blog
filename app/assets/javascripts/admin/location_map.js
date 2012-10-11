var LocationMap = Backbone.View.extend({
	initialize: function () {
		var form = this,
		loc = form.model

		this.locationHash = {}
		if( this.model ) {
			this.setModel(this.model);
		}
	},
	setModel:function (model) {
		this.model = model;
		this.modelClone = this.model.clone();
		if( this.model.country ) {
	 		this.modelClone.setCountry(this.model.country)
	 	}
	},
	showLocationString:function(string) {
		this.options.geoElem.innerHTML = string;
	},
	_bindMapClicks: function () {
		var form = this,
		loc = form.model,
		decoder = new GeocodeDecoder();

		google.maps.event.addListener(form.options.map, "click", function (mapEvent) {
			decoder.decode(mapEvent.latLng, {
			success:function (result) {
				if( result.data ) {
					form.options.countryCollection.fetch({
						success:function () {
							var country = form.options.countryCollection.findByName(result.data.country);
							if(!country) { return }
							form.modelClone.set({
								city: result.data.city || "",
								state: result.data.state || "",
								latitude: mapEvent.latLng.lat(),
								longitude: mapEvent.latLng.lng()
							})
							form.modelClone.setCountry( country );
							form.showLocationString( form.modelClone.geoString({includeTitle:false}) );
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
	bindMap: function () {
		var form = this;

		form.options.doneButton.addEventListener("click", function () {
			form.model.set(form.modelClone.attributes, {silent:true});
			form.model.setCountry(form.modelClone.country);
			form.el.className = form.el.className.replace(" map-active", "");
			form.markerClone.removeMarker();
			if( form.options.originalMapOptions ) {
				form.options.map.setOptions(form.options.originalMapOptions);
			}
			form.trigger("done");
		})

		form.options.titleElem.addEventListener("keyup", function (e) {
			form.modelClone.set({title: e.currentTarget.value});
		})

		var loc = form.model;

		form._bindMapClicks();

		this.markerClone = new LocationMarker({
	        model:this.modelClone,
	        map:this.options.map
	    });

	    form.options.map.setOptions({
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            disableDefaultUI:false,
            scrollwheel: true,
            maxZoom:100
        })

		form.drawMapMarker();
		form.el.className += " map-active";
	},
	render: function () {
		this.bindMap();

	}
})