window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-maps\-new\s/.test(document.body.className) ) { return }

	var location = Location.createFromDataAttribute(document.getElementById("location")),
	input = new FileInput({
		el:document.getElementById("map-input"),
		input:document.getElementById("map-input-button")
	}).render();

	location.setUser(TA.currentUser);
	
	document.getElementById("map-upload").addEventListener("click", function (e) {
		e.preventDefault();
		var files = input.files;
		_.each(files, function (file) {
			var map = new Map();
			map.setLocation(location);
			map.attachFile(file);
			var mapElem = document.getElementById("map");

			var mapOptions = {
	            center: new google.maps.LatLng(0,0),
	            zoom: 4,
	            mapTypeId: google.maps.MapTypeId.HYBRID,
	            scrollwheel: false
	        },
	    	googleMap = new google.maps.Map(mapElem, mapOptions);

	    	map.saveTmp({
	    		success:function (e) {
	    			var geo = new google.maps.KmlLayer(e.url);
	    			debugger
	    			geo.setMap(googleMap);
	    		}
	    	})

		})
	})
})