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

	trip.on("error", function (e, error) {
		if( error.title ) {
			showError("Please title your trip");
		}
	})

	function showError(message) {
		var error = document.createElement("p");
		error.className = "error";
		error.innerHTML = message;
		document.getElementById("form-message").appendChild(error);
	}

	document.getElementById("trip-save").addEventListener("click", function (e) {
		e.preventDefault();
		if( trip.locations().length === 0 ) {
			showError("Please select at least one location");
			return;
		}

		trip.saveWithLocations({
			success:function () {
				window.location.href = trip.editUrl();
			}
		})
	})

})