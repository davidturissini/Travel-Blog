window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-maps\-edit\s/.test(document.body.className) ) { return }

	var map = Map.createFromDataAttribute( document.getElementById("map") ),
	trip = Trip.createFromDataAttribute( document.getElementById("map"), "data-trip");
	trip.setUser(TA.currentUser);
	map.setTrip(trip);

    new AutoSaveTextField({
        el:document.getElementById("map-title"),
        model:map,
        property:"title"
    }).render();

    map.drawGoogleMap(document.getElementById("google-map"));
})