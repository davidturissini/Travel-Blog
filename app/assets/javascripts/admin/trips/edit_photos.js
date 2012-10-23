window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-trips\-edit_photos/.test(document.body.className) ) { return }

	/*

		INITIALIZE LOCATION

	*/
	var trip = Trip.createFromDataAttribute( document.getElementById("trip") );
	trip.setUser(TA.currentUser);

	[].forEach.call(document.getElementsByClassName("photo"), function (elem) {
		var photo = Photo.createFromDataAttribute(elem);
		photo.setTrip(trip);

		var form = new PhotoForm({
			model:photo,
			el:elem
		});

		form.on("removed", function () {
			photo.destroy()
		})

		form.render();
	})


})