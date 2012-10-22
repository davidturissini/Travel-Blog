var LocationMarker = LocationMarker.extend({
	makeInteractive:function () {
		var marker = this,
		loc = this.marker,
		decoder = new GeocodeDecoder(),
		countryCollection = marker.options.countryCollection || TA.countries;

		google.maps.event.addListener(this.googleMarker, "click", function (e) {
			marker.trigger("click", {mapEvent:e});
		})

		google.maps.event.addListener(this.googleMarker, "dragend", function (mapEvent) {
			decoder.decode(mapEvent.latLng, {
			success:function (result) {
				if( result.data ) {
					countryCollection.fetch({
						success:function () {
							var country = countryCollection.findByName(result.data.country);
							if(!country) { return }
							marker.model.setCountry( country );
							marker.model.set({
								city: result.data.city || "",
								state: result.data.state || "",
								latitude: mapEvent.latLng.lat(),
								longitude: mapEvent.latLng.lng()
							})
						}
					})
				}
				}
			})
		});
		this.googleMarker.setOptions({draggable:true})
	}
})