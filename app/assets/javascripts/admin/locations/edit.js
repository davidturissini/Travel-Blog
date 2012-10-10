window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-locations\-edit/.test(document.body.className) ) { return }
    var location = Location.createFromDataAttribute( document.getElementById("location") ),
    map = new google.maps.Map(document.getElementById("map"), {
            center: new google.maps.LatLng(location.get("latitude") || 40.7142, location.get("longitude") || -74.0064),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.HYBRID
        }),
    mapMarker = new LocationMarker({
        model:location,
        map:map
    });

    mapMarker.drawMarker();


    location.setUser(TA.currentUser);

    location.loadCountry({
        success:function () {
            var locationMap = new LocationMap({
                el:document.getElementById("location"),
                model:location,
                countryCollection:TA.countries,
                titleElem:document.getElementById("location-title"),
                map:map,
                mapMarker:mapMarker,
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

            document.getElementById("location-save").addEventListener("click", function () {
                var loading = new Loading({
                    el:document.body
                });
                loading.render();
                loading.loading();
                form.model.save({}, {
                    success:function () {
                        form.trigger("location_save", {location:form.model});
                        form.markerClone.removeMarker();
                        loading.loadingDone();
                    }
                });
            })
            
            var removeElem = document.getElementById("delete-location");
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
    });
})