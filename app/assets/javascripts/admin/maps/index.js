window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-maps\-index\s/.test(document.body.className) ) { return }

	var maps = document.getElementsByClassName("map");
	[].forEach.call(maps, function (elem) {
		var map = Map.createFromDataAttribute(elem),
		location = Location.createFromDataAttribute(document.getElementById("location")),
        mapElem = elem.getElementsByClassName("google-map").item(0),
		mapOptions = {
            center: new google.maps.LatLng(0,0),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            disableDefaultUI:true,
            scrollwheel: false
        };

        location.setUser(TA.currentUser);
        map.setLocation(location);
    	var googleMap = new google.maps.Map(mapElem, mapOptions),
    	kmlLayer = new google.maps.KmlLayer(map.staticUrl());
	    kmlLayer.setMap(googleMap);

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