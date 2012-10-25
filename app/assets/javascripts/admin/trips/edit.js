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
    });

    var dateField = new DateField({
        el:document.getElementById("trip-dates"),
        model:trip
    });

    dateField.render();
 	
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

        if( changed.changes.start_date || changed.changes.end_date ) {
            trip.save({});
        }
    })


    var photoElem = document.getElementById("photos"),
    images = photoElem.getElementsByClassName("image");
    [].forEach.call(images, function (image, index) {
        var left = photoElem.offsetWidth / 2 - image.offsetWidth / 2,
        top = photoElem.offsetHeight / 2 - image.offsetHeight / 2,
        degrees = (index === images.length - 1 ? 0 : (Math.random() - .5) * 45);

        left += (Math.random() - .5) * (photoElem.offsetWidth / 3);
        top += (Math.random() - .5) * (photoElem.offsetWidth / 3);

        image.style.left = left + "px";
        image.style.top = top + "px";
        image.style.webkitTransform = "rotate(" + degrees + "deg)";
        image.style.opacity = 1;
    })
    
})