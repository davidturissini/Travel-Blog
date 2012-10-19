window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-maps\-edit\s/.test(document.body.className) ) { return }

	var map = Map.createFromDataAttribute( document.getElementById("map") ),
	location = Location.createFromDataAttribute( document.getElementById("map"), "data-location");
	location.setUser(TA.currentUser);
	map.setLocation(location);

	document.getElementById("map-title").addEventListener("keyup", (function () {
        var timeout = null;
        return function (e) {
            map.set({title:e.currentTarget.value});
            if( timeout ) { clearTimeout(timeout); };
            timeout = setTimeout(function () {
                map.save({});
            }, 500);
        }
    })())
})