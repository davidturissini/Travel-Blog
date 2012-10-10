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
	 	this.showLocationString("");
	},
	showLocationString:function(string) {
		if( this.el.querySelector("h1") ) {
			this.el.querySelector("h1").innerHTML = string;
		}
	},
	_bindMapClicks: function () {
		var form = this,
		loc = form.model,
		decoder = new GeocodeDecoder();

		google.maps.event.addListener(form.map, "click", function (mapEvent) {
			decoder.decode(mapEvent.latLng, {
			success:function (result) {
				if( result.data ) {
					form.options.countryCollection.fetch({
						success:function () {
							var country = form.options.countryCollection.findByName(result.data.country);
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
		this.mapMarker.render()
	},
	showMap: function () {
		var form = this,
		titleElem = form.el.querySelector(".title");

		form.el.querySelector(".save").addEventListener("click", function () {
			form.model.set(form.modelClone.attributes, {silent:true});
			form.model.setCountry(form.modelClone.country);
		})

		titleElem.addEventListener("keyup", function (e) {
			form.modelClone.set({title: e.currentTarget.value});
		})

		var loc = form.model;

		form.map = new google.maps.Map(form.options.mapElem, {
			center: new google.maps.LatLng(form.modelClone.get("latitude") || 40.7142, form.modelClone.get("longitude") || -74.0064),
			zoom: 4,
			mapTypeId: google.maps.MapTypeId.HYBRID
		})

		form._bindMapClicks()
		form.mapMarker = new LocationMarker({
			model:form.modelClone,
			map:form.map,
			locationType:loc.locationType
		})
		form.drawMapMarker();
	},
	render: function () {
		var form = this,
		loc = form.model

		form.showMap();

	}
})