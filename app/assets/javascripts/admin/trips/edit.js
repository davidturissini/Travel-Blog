window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-trips\-edit\s/.test(document.body.className) ) { return }

	var trip = Trip.createFromDataAttribute(document.getElementById("trip")),
	locationsCollection = LocationsCollection.createFromDataAttribute(document.getElementById("trip"), "data-locations")
	trip.setLocations( locationsCollection );
 	
 	new TripMap({
 		model:trip,
 		el:document.getElementById("trip-map")
 	}).render();
})