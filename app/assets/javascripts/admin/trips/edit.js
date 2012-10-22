window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-trips\-edit\s/.test(document.body.className) ) { return }

	var trip = Trip.createFromDataAttribute(document.getElementById("trip")),
	locationsCollection = LocationsCollection.createFromDataAttribute(document.getElementById("trip"), "data-locations"),
    maps = MapsCollection.createFromDataAttribute(document.getElementById("trip"), "data-maps");
	trip.setUser(TA.currentUser);
	trip.setLocations( locationsCollection );

    document.getElementById("trip-delete").addEventListener("click", function () {
        if( confirm("Delete " + trip.get("title") + "? This cannot be undone.") ) {
            trip.destroy({
                success:function () {
                    window.location.href = TA.currentUser.url({includeFormat:false});
                }
            })
        }
    })

 	
 	new TripMap({
 		model:trip,
 		el:document.getElementById("trip-map")
 	}).mergeMapOptions({
        disableDefaultUI:true
    }).render();

    new AutoSaveTextField({
        model:trip,
        el:document.getElementById("trip-title"),
        property:"title"
    }).render();

    var tripPhotoLink = document.getElementById("change-trip-photo");
    if( tripPhotoLink ) {
        tripPhotoLink.addEventListener("click", function () {
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
    }

    trip.on("change",function (e, changed) {
        if( changed.changes.photo_id ) {
            var image = document.getElementById("trip-image");
            image.setAttribute("src", trip.photo().source());
        }
    })
    
})