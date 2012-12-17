window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-trips\-new\s/.test(document.body.className) ) { return }

	var trip = new Trip(),
	feedback = new UserFeedback({
		el:document.getElementById("form-message")
	}).render(),
	summaryEl = document.getElementById("trip-summary");
	trip.setUser(TA.currentUser);

	var dateField = new DateField({
		el:document.getElementsByClassName("trip-date").item(0),
		model:trip
	});

	dateField.render();

	var tripMap = new TripMap({
		model:trip,
		el:document.getElementById("google-map")
	});

	tripMap.on("location_click", function (e) {
		var location = e.location;

		if( !location.infowindow ) {
			location.infowindow = new LocationInfowindow({
				model:location,
				map:tripMap.googleMap()
			}).render();

			location.infowindow.on("html_load", function (e) {
				var html = e.html,
				titleElem = html.getElementsByClassName("location-title").item(0);
				titleElem.addEventListener("keyup", function (e) {
					location.set({title:e.currentTarget.value});
				})
			})
		}


		location.infowindow.toggle();
	})

	tripMap.render();
	tripMap.startEdit();

	document.getElementById("trip-title").addEventListener("keyup", function (e) {
		trip.set({title:e.currentTarget.value});
	})

    summaryEl.addEventListener("keyup", function (e) {
    	trip.set({summary:e.currentTarget.value});
    })

	trip.on("error", function (e, error) {
		if( error.title ) {
			feedback.showError("Please title your trip");
		}
	})

	document.getElementById("trip-save").addEventListener("click", function (e) {
		e.preventDefault();
		if( trip.locations().length === 0 ) {
			feedback.showError("Please select at least one location");
			return;
		}

		trip.saveWithLocations({
			success:function () {
				window.location.href = trip.editUrl();
			}
		})
	})

})