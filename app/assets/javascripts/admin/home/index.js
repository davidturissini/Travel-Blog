window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-users\-me\s/.test(document.body.className) ) { return }

	[].forEach.call(document.getElementsByClassName("trip"), function (elem) {
		var trip = Trip.createFromDataAttribute(elem),
		remove = elem.getElementsByClassName("remove").item(0),
		titleEl = elem.getElementsByClassName("trip-title").item(0),
		dateEl = elem.getElementsByClassName("trip-date").item(0);

		trip.setUser(TA.currentUser);


	})
})