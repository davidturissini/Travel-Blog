window.addEventListener("DOMContentLoaded", function () {
	if( !/\strips\-show\s/.test(document.body.className) ) { return }

	var tripEl = document.getElementById("trip"),
    trip = Trip.createFromDataAttribute( tripEl ),
	user = User.createFromDataAttribute(tripEl, "data-user"),
	locations = LocationsCollection.createFromDataAttribute(tripEl, "data-locations"),
	maps = MapsCollection.createFromDataAttribute(tripEl, "data-maps"),
	gallery = null,
	mapOptions = {zoom:10,draggable:false,disableDefaultUI:true},
	tripMapsEl = tripEl.getElementsByClassName("trip-map").item(0);

	trip.setUser(user);
	trip.setLocations(locations);
	trip.setMaps(maps);

	var maps = new TripMap({
		el:tripMapsEl,
		model:trip
	});
	maps.mergeMapOptions(mapOptions);
	maps.render().drawMaps().drawLocations();

	var images = document.getElementsByClassName("photo");
    [].forEach.call(images, function (image, index) {
        var jsImage = new Image(),
        imageHTML = image.getElementsByTagName("img").item(0);

        function doRotate(){
            var parent = image.parentNode,
            left = parent.offsetWidth / 2 - image.offsetWidth / 2,
            top = parent.offsetHeight / 2 - image.offsetHeight / 2,
            degrees = (Math.random() - .5) * 45;

            left += (Math.random() - .5) * (parent.offsetWidth);
            top += (Math.random() - .5) * (parent.offsetHeight);

            image.style.left = left + "px";
            image.style.top = top + "px";
            image.style.webkitTransform = "rotate(" + degrees + "deg)";
            image.style.mozTransform = "rotate(" + degrees + "deg)";
            setTimeout(function () {
                image.style.opacity = 1;
            }, 100 * index);
        }

        if( !imageHTML ) {
            doRotate();
            return;
        }

        jsImage.onload = function () {
            doRotate();
        }

        jsImage.src = image.getElementsByTagName("img").item(0).getAttribute("src");
    })

})