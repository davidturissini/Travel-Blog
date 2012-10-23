window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-maps\-index\s/.test(document.body.className) ) { return }

	var maps = document.getElementsByClassName("map");
	[].forEach.call(maps, function (elem) {
		var map = Map.createFromDataAttribute(elem),
		trip = Trip.createFromDataAttribute(document.getElementById("trip")),
        mapElem = elem.getElementsByClassName("google-map").item(0),
        titleEl = elem.getElementsByClassName("map-title").item(0),
        descriptionEl = elem.getElementsByClassName("map-description").item(0);

        trip.setUser(TA.currentUser);
        map.setTrip(trip);

        new DynamicTextarea({
            el:descriptionEl
        }).render();

        new DynamicTextarea({
            el:titleEl
        }).render();

        new AutoSaveTextField({
            model:map,
            el:titleEl,
            property:"title"
        }).render();

        new AutoSaveTextField({
            model:map,
            el:descriptionEl,
            property:"description"
        }).render();

        map.drawGoogleMap(mapElem, {
            center: new google.maps.LatLng(0,0),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            disableDefaultUI:true,
            scrollwheel: false
        })

        var removeElem = elem.getElementsByClassName("remove").item(0);
        removeElem.addEventListener("click", function () {
            if( confirm("Delete map? This cannot be undone.") ) {
                map.destroy({
                    success:function () {
                        elem.parentNode.removeChild(elem);
                    }
                })
            }
        })

	})
})