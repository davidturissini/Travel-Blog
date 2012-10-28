window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-maps\-new\s/.test(document.body.className) ) { return }

	var trip = Trip.createFromDataAttribute(document.getElementById("trip")),
	map = new Map();
	input = new FileInput({
		el:document.getElementById("map-input"),
		input:document.getElementById("map-input-button"),
		dropTarget:document
	}).render(),
	loading = new Loading({
		el:document.body
	}).render();

	trip.setUser(TA.currentUser);
	map.setTrip(trip);

	map.drawGoogleMap(document.getElementById("google-map"));

	document.getElementById("map-title").addEventListener("keyup", function (e) {
		map.set({title:e.currentTarget.value});
	})

	new DateField({
        el:document.getElementsByClassName("map-date").item(0),
        model:map
    }).render();

	document.getElementById("map-save").addEventListener("click", function (e) {
		e.preventDefault();
		loading.setMessage("Saving map...");
		loading.loading();
		map.saveWithXML({
			success:function (e) {
				window.location.href = trip.mapsUrl();
			}
		})
	})

	input.on("file_added", (function () {
		var geo;
		return function (event) {
			if( geo && geo.setMap ) { geo.setMap(null); }
			
			map.setTrip(trip);
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