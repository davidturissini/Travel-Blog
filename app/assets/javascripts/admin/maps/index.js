window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-maps\-index\s/.test(document.body.className) ) { return }

	var maps = document.getElementsByClassName("map");
	[].forEach.call(maps, function (elem) {
		var map = Map.createFromDataAttribute(elem),
		trip = Trip.createFromDataAttribute(document.getElementById("trip")),
        mapElem = elem.getElementsByClassName("google-map").item(0),
        titleEl = elem.getElementsByClassName("map-title").item(0),
        descriptionEl = elem.getElementsByClassName("map-description").item(0),
        dateEl = elem.getElementsByClassName("date-field").item(0),
        googleMap = new GoogleMap({
            el:mapElem
        });

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

        new DateField({
            el:dateEl,
            model:map,
            autoUpdate:true
        }).render();

        googleMap.render();
        googleMap.drawMap(map);

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