window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-locations\-edit\s/.test(document.body.className) ) { return }

	var location = Location.createFromDataAttribute(document.getElementById("location")),
	trip = Trip.createFromDataAttribute(document.getElementById("location"), "data-trip"),
	map = new LocationMap({
		model:location,
		el:document.getElementById("location-map"),
		draggable:true,
		autoSave:true
	});

	new AutoSaveTextField({
		model:location,
		property:"title",
		el:document.getElementById("location-title")
	}).render();

	location.on("change", function (e, options) {
		if( options.changes.latitude || options.changes.longitude ) {
			document.getElementById("location-geo").innerHTML = location.geoString({includeTitle:false});
		}
	})

	trip.setUser(TA.currentUser);
	location.setTrip(trip);

	map.render();
	map.startEdit();

	location.on("change", function (e, changed) {
		if( changed.changes.latitude || changed.changes.longitude ) {
			location.save({})
		}
	})
})