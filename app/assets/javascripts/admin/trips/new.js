window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-trips\-new\s/.test(document.body.className) ) { return }

	var trip = new Trip();
	trip.setUser(TA.currentUser);

	var tripMap = new TripMap({
		model:trip,
		el:document.getElementById("google-map")
	});

	tripMap.render();
	tripMap.startEdit();

	document.getElementById("trip-title").addEventListener("keyup", function (e) {
		trip.set({title:e.currentTarget.value});
	})

	document.getElementById("trip-save").addEventListener("click", function (e) {
		e.preventDefault();
		trip.saveWithLocations({
			success:function () {
				window.location.href = trip.editUrl();
			}
		})
	})

})