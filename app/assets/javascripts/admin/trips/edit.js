window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-trips\-edit\s/.test(document.body.className) ) { return }

	var trip = Trip.createFromDataAttribute(document.getElementById("trip")),
	locationsCollection = LocationsCollection.createFromDataAttribute(document.getElementById("trip"), "data-locations");
	trip.setUser(TA.currentUser);
	trip.setLocations( locationsCollection );
 	
 	new TripMap({
 		model:trip,
 		el:document.getElementById("trip-map")
 	}).render();

    new AutoSaveTextField({
        model:trip,
        el:document.getElementById("trip-title"),
        property:"title"
    }).render();

    document.getElementById("change-trip-photo").addEventListener("click", function () {
        var dialog = new TripPhotoDialog({
            model:trip
        });

        dialog.on("photo_click", function (e) {
            trip.setPhoto(e.photo);
            trip.save({}, {
                success:function () {
                    dialog.close();
                }
            })
        })

        dialog.render();
    });

    trip.on("change",function (e, changed) {
        if( changed.changes.photo_id ) {
            var image = document.getElementById("trip-image");
            image.setAttribute("src", trip.photo().source());
        }
    })
    
})