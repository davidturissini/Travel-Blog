window.addEventListener("DOMContentLoaded", function () {
	if( !/\strips\-show\s/.test(document.body.className) ) { return }
	var trip = Trip.createFromDataAttribute(document.getElementById("trip")),
	locationsCollection = LocationsCollection.createFromDataAttribute(document.getElementById("trip"), "data-locations"),
    maps = MapsCollection.createFromDataAttribute(document.getElementById("trip"), "data-maps");
	trip.setUser(TA.currentUser);
	trip.setLocations( locationsCollection );
    trip.setMaps(maps);

    document.getElementById("trip-delete").addEventListener("click", function () {
        if( confirm("Delete " + trip.get("title") + "? This cannot be undone.") ) {
            trip.destroy({
                success:function () {
                    window.location.href = TA.currentUser.url({includeFormat:false});
                }
            })
        }
    });

    var dateField = new DateField({
        el:document.getElementsByClassName("trip-date").item(0),
        model:trip
    });

    dateField.render();
 	
 	new TripMap({
 		model:trip,
 		el:document.getElementById("trip-locations-map")
 	}).mergeMapOptions({
        disableDefaultUI:true,
        draggable:false
    }).render().drawLocations();

    new TripMap({
        model:trip,
        el:document.getElementById("admin-trip-maps")
    }).mergeMapOptions({
        disableDefaultUI:true,
        draggable:false
    }).render().drawMaps();

    new AutoSaveTextField({
        model:trip,
        el:document.getElementById("trip-title"),
        property:"title"
    }).render();

    var tripPhotoLink = document.getElementById("change-trip-photo");
    if( tripPhotoLink ) {
        tripPhotoLink.addEventListener("click", function (evt) {
            evt.preventDefault();
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

        if( changed.changes.start_date || changed.changes.end_date ) {
            trip.save({});
        }
    })
    
})