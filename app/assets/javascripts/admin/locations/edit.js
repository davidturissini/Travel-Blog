window.addEventListener("DOMContentLoaded", function () {
	if( 
        !/admin\-locations\-edit\s/.test(document.body.className) &&
        !/admin\-locations\-new\s/.test(document.body.className)
     ) { return }

    var location = Location.createFromDataAttribute( document.getElementById("location") ),
    mapOptions = {
            center: location.latLng(),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            disableDefaultUI:true,
            scrollwheel: false,
            maxZoom:4
        },
    map = new google.maps.Map(document.getElementById("map"), mapOptions),
    mapMarker = new LocationMarker({
        model:location,
        map:map
    });

    mapMarker.drawMarker();

    location.setUser(TA.currentUser);

    [].forEach.call(document.getElementsByClassName("location-photo"), function (elem) {
        new LocationPhotoView({
            el:elem,
            model:location
        }).render();
    })

    document.getElementById("location-title").addEventListener("keyup", (function () {
        var timeout = null;
        return function (e) {
            location.set({title:e.currentTarget.value});
            if( timeout ) { clearTimeout(timeout) };
            setTimeout(function () {
                location.save({});
            }, 500);
        }
    })())

    location.loadCountry({
        success:function () {
            var locationMap = new LocationMap({
                el:document.getElementById("location"),
                model:location,
                countryCollection:TA.countries,
                titleElem:document.getElementById("location-title"),
                map:map,
                mapMarker:mapMarker,
                originalMapOptions:mapOptions,
                doneButton:document.getElementById("map-edit-done"),
                geoElem:document.getElementById("location-geo")
            }),
            editElem = document.getElementById("edit-location");

            editElem.addEventListener("click", function (e) {
                e.preventDefault();
                locationMap.setModel( location );
                locationMap.render();
                mapMarker.removeMarker();
            });

            locationMap.on("done", function () {
                map.setCenter(location.latLng());
                mapMarker.drawMarker();
                location.save({});
            });

            document.getElementById("change-location-photo").addEventListener("click", function () {
                var dialog = new LocationPhotoDialog({
                    model:location
                });

                dialog.on("photo_click", function (e) {
                    location.setPhoto(e.photo);
                    location.save({}, {
                        success:function () {
                            dialog.close();
                        }
                    })
                })

                dialog.render();
            });
            
            var removeElem = document.getElementById("delete-location");
            if( removeElem ) {
                removeElem.addEventListener("click", function (e) {
                    e.stopPropagation();
                    if( confirm("Delete " + location.geoString() + "?"))
                    location.destroy({
                        success:function () {
                            window.location.href = TA.currentUser.url({includeFormat:false});
                        }
                    })
                })
            }
        }
    });
})