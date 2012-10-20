window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-maps\-new\s/.test(document.body.className) ) { return }

	var location = Location.createFromDataAttribute(document.getElementById("location")),
	map = new Map();
	input = new FileInput({
		el:document.getElementById("map-input"),
		input:document.getElementById("map-input-button"),
		dropTarget:document.getElementById("google-map")
	}).render(),
	loading = new Loading({
		el:document.body
	}).render();

	location.setUser(TA.currentUser);
	map.setLocation(location);

	map.drawGoogleMap(document.getElementById("google-map"));

	document.getElementById("map-title").addEventListener("keyup", function (e) {
		map.set({title:e.currentTarget.value});
	})

	document.getElementById("map-save").addEventListener("click", function (e) {
		e.preventDefault();
		loading.setMessage("Saving map...");
		loading.loading();
		map.saveWithXML({
			success:function (e) {
				window.location.href = location.mapsUrl();
			}
		})
	})

	input.on("file_added", (function () {
		var geo;
		return function (event) {
			if( geo && geo.setMap ) { geo.setMap(null); }
			
			map.setLocation(location);
			map.attachFile(event.file);

			loading.setMessage("Parsing Map...")
			loading.loading();

	    	map.stageXML({
	    		success:function (e) {
	    			geo = new google.maps.KmlLayer(e.url);
	    			geo.setMap(map.googleMap());
	    			loading.doneLoading();
	    		}
	    	})
		}
	})())
})