window.addEventListener("DOMContentLoaded", function () {
	if( !/\susers\-show\s/.test(document.body.className) ) { return }

	var userEl = document.getElementById("user"),
	user = User.createFromDataAttribute(userEl),
	trips = new TripsCollection(),
	mapEl = document.getElementById("map"),
	map = new GoogleMap({
		el:mapEl
	});

	map.mergeMapOptions({
		disableDefaultUI:true
	});

	map.render();
	user.setTrips(trips);
	
	[].forEach.call(document.getElementsByClassName("trip"), function (tripEl) {
		var trip = Trip.createFromDataAttribute(tripEl),
		maps = MapsCollection.createFromDataAttribute(tripEl, "data-maps"),
		locations = LocationsCollection.createFromDataAttribute(tripEl, "data-locations"),
		map = new TripMap({
			el:tripEl,
			model:trip
		});

		trip.setUser(user);
		trip.setMaps(maps);
		trip.setLocations(locations);

		map.addLocations(locations, {silent:true});

		trips.add(trip);
	});

	map.drawLocations();
	map.on("location_mouseover", function (e) {
		var marker = e.marker;
		marker.model.setUser(marker.model.trip().user());
		var infoWindow = new LocationInfowindow({
			model:marker.model,
			map:map.googleMap()
		});

		infoWindow.show();
	})
});