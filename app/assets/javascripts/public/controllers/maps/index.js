window.addEventListener("DOMContentLoaded", function () {
	if( !/\smaps\-index\s/.test(document.body.className) ) { return }

	var mapEl = document.getElementById("map"),
	trip = Trip.createFromDataAttribute(mapEl, "data-trip"),
	maps = MapsCollection.createFromDataAttribute(mapEl),
	user = User.createFromDataAttribute(mapEl, "data-user"),
	locations = LocationsCollection.createFromDataAttribute(mapEl, "data-locations");

	trip.setUser(user);
	trip.setMaps(maps);
	trip.setLocations(locations);

	var tripMap = new TripMap({
		el:mapEl,
		model:trip
	});

	tripMap.render().drawMaps().drawLocations();

	tripMap.on("location_mouseover", function (e) {
		var marker = e.marker;
		marker.model.setUser(marker.model.trip().user());
		var infoWindow = new LocationInfowindow({
			model:marker.model,
			map:tripMap.googleMap()
		});

		infoWindow.show();
	});

	tripMap.on("location_click", function (evt) {
		window.location.href = evt.marker.model.trip().url();
	});

})