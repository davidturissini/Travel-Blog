window.addEventListener("DOMContentLoaded", function () {
	if( !/\smaps\-index\s/.test(document.body.className) ) { return }

	var mapEl = document.getElementById("map"),
	trip = Trip.createFromDataAttribute(mapEl, "data-trip"),
	maps = MapsCollection.createFromDataAttribute(mapEl),
	user = User.createFromDataAttribute(mapEl, "data-user");

	trip.setUser(user);
	trip.setMaps(maps);

	var tripMap = new TripMap({
		el:mapEl,
		model:trip
	});

	tripMap.render().drawMaps();

})