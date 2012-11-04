var TripMap = TripMap.extend((function () {

	var _countries = TA.countries;

	return {
		_bindMapClicks: function () {
			var form = this,
			loc = form.model,
			decoder = new GeocodeDecoder();

			google.maps.event.addListener(form.googleMap(), "click", function (mapEvent) {
				decoder.decode(mapEvent.latLng, {
				success:function (result) {
					if( result.data ) {
						_countries.fetch({
							success:function () {
								var country = _countries.findByName(result.data.country);
								if(!country) { return }
								var location = new Location({
									city: result.data.city || "",
									state: result.data.state || "",
									latitude: mapEvent.latLng.lat(),
									longitude: mapEvent.latLng.lng()
								})
								location.setCountry( country );
								var marker = new LocationMarker({
						            model:location,
						            map:form.googleMap(),
						            draggable:true
						        }).render();

						        form.model.locations().add(location);
						        form.makeMarkerInteractive(marker);
							}
						})
					}
					}
				})
			});

		},
		makeMarkerInteractive:function (marker) {
			var view = this;
			marker.makeInteractive();

	        marker.on("click", function (e) {
	        	e.location = marker.model;
	        	view.trigger("location_click", e)
	        })
		},
		startEdit:function () {
			var view = this;
			this._bindMapClicks();
			_.each(this.markers, function (marker) {
				view.makeMarkerInteractive(marker);
			})
		},
		doneEdit:function () {

		}
	}
})());