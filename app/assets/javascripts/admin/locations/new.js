window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-locations\-new\s/.test(document.body.className) ) { return }

	var location = new Location(),
	trip = Trip.createFromDataAttribute(document.getElementById("location"), "data-trip"),
	feedback = new UserFeedback({
		el:document.getElementById("messages")
	}).render();
	trip.setUser(TA.currentUser);
	location.setTrip(trip);

	var locMap = new LocationMap({
		model:location,
		el:document.getElementById("google-map")
	}).render();

	locMap.startEdit();

	location.on("change", function (e, options) {
		if( options.changes.latitude || options.changes.longitude ) {
			document.getElementById("location-geo").innerHTML = location.geoString({includeTitle:false});
		}
	})

	document.getElementById("location-title").addEventListener("keyup", function (e) {
		location.set({title:e.currentTarget.value});
	})

	document.getElementById("location-save").addEventListener("click", function (e) {
		e.preventDefault();

		if( !location.get("latitude") || !location.get("longitude") ) {
			feedback.showError("Please select a location on the map.")
			return;
		}

		location.save({}, {
			success:function () {
				window.location.href = location.editUrl();
			},
			error:function (e, a) {
				feedback.showError("There was a problem with your request. Please try again in a few minutes.");
			}
		})
	})
})