window.addEventListener("DOMContentLoaded", function () {
	if( !/\strips\-show\s/.test(document.body.className) ) { return }

	var trip = Trip.createFromDataAttribute( document.getElementById("trip") ),
	user = User.createFromDataAttribute(document.getElementById("trip"), "data-user"),
	locations = LocationsCollection.createFromDataAttribute(document.getElementById("trip"), "data-locations"),
	maps = MapsCollection.createFromDataAttribute(document.getElementById("trip"), "data-maps"),
	gallery = null,
	mapOptions = {zoom:8,draggable:false,disableDefaultUI:true},
	tripMapsEl = document.getElementById("trip-maps");

	trip.setUser(user);
	trip.setLocations(locations);
	trip.setMaps(maps);

	var tripMap = new TripMap({
		el:document.getElementById("trip-locations"),
		model:trip
	});
	tripMap.mergeMapOptions(mapOptions);
	tripMap.render().drawLocations();

	if( tripMapsEl ) {
		var maps = new TripMap({
			el:tripMapsEl,
			model:trip
		});
		maps.mergeMapOptions(mapOptions);
		maps.render().drawMaps();
	}

	if( !document.getElementById("photos") ) { return }
	var locationPhotos = document.getElementById("photos").querySelectorAll("figure"),
	hero = document.getElementById("photos").querySelector(".hero") || locationPhotos[0];
	hero.className += " hero";

	if( locationPhotos.length === 0 ) { return }
	var heroIndex = (function () {
		var index = 0;
		[].forEach.call(locationPhotos, function (photo, i) {
			if( photo == hero ) {
				index = i
			}
		})

		return index;
	})();


	var shuffleHash = {
		el:document.getElementById("photos"),
		hero:hero,
		elements:Array.prototype.slice.call(locationPhotos, 0, 30),
		heroClick: function () {
			if( !gallery ) {
				gallery = new Gallery({
						el:shuffleHash.el,
						photos:locationPhotos,
						selectedIndex:heroIndex,
						onClose:function () {
							gallery = null
							
						}
					}).render()
			}
		},
		elementClick: function (event, options) {
			if( !gallery ) {
				gallery = new Gallery({
						el:shuffleHash.el,
						photos:locationPhotos,
						selectedIndex:options.index,
						onClose:function () {
							gallery = null
							
						}
					}).render()
			}
		},
		elementShouldPosition: function (options) {
			var photo = options.element.querySelector("img")
			if( photo.width != 0 ) {
				options.callback()
			} else {
				photo.onload = function () {
					options.callback()
				}
			}
		}
	}

	new ShuffledElements(shuffleHash).render()

})