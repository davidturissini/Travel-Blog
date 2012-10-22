window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-trips\-edit_locations\s/.test(document.body.className) ) { return }

	var trip = Trip.createFromDataAttribute(document.getElementById("trip")),
	locations = LocationsCollection.createFromDataAttribute(document.getElementById("trip"), "data-locations")
	trip.setUser(TA.currentUser);
	trip.setLocations(locations);

	locations.each(function (loc) {
		loc.on("change", function (e, changed) {
			if( changed.changes.longitude || changed.changes.longitude ) {
				loc.save({});
			}
		})
	})

	var tripMap = new TripMap({
		model:trip,
		el:document.getElementById("trip-map")
	});

	tripMap.on("location_click", function (e) {
		var location = e.location;

		locations.each(function (loc) {
			if( loc === location || !loc.infowindow ) { return }
			loc.infowindow.hide()
		})

		if( !location.infowindow ) {
			location.infowindow = new LocationInfowindow({
				model:location,
				map:tripMap.googleMap()
			}).render();

			location.infowindow.on("html_load", function (e) {
				var html = e.html;
				new AutoSaveTextField({
					el:html.getElementsByClassName("location-title").item(0),
					model:location,
					property:"title"
				}).render();
			})
		}


		location.infowindow.toggle();
	})

	tripMap.render();
	tripMap.startEdit();

	locations.on("add", function (model) {
		model.setTrip(trip);
		model.save({})
	})

})