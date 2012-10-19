window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-maps\-index\s/.test(document.body.className) ) { return }

	var maps = document.getElementsByClassName("map");
	[].forEach.call(maps, function (elem) {
		var map = Map.createFromDataAttribute(elem),
		location = Location.createFromDataAttribute(document.getElementById("location")),
		mapOptions = {
            center: new google.maps.LatLng(0,0),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            disableDefaultUI:true,
            scrollwheel: false
        };

        location.setUser(TA.currentUser);
        map.setLocation(location);
    	var googleMap = new google.maps.Map(elem, mapOptions),
    	kmlLayer = new google.maps.KmlLayer(map.staticUrl());
	    kmlLayer.setMap(googleMap);

	})
})