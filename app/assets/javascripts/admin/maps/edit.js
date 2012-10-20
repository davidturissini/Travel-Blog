window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-maps\-edit\s/.test(document.body.className) ) { return }

	var map = Map.createFromDataAttribute( document.getElementById("map") ),
	location = Location.createFromDataAttribute( document.getElementById("map"), "data-location");
	location.setUser(TA.currentUser);
	map.setLocation(location);

    new AutoSaveTextField({
        el:document.getElementById("map-title"),
        model:map,
        property:"title"
    }).render();

    map.drawGoogleMap(document.getElementById("google-map"));
})