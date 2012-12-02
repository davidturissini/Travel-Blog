window.addEventListener("DOMContentLoaded", function () {
	if( !/\smaps\-index\s/.test(document.body.className) ) { return }

	var mapEl = document.getElementById("map"),
	trip = Trip.createFromDataAttribute(mapEl, "data-trip"),
	maps = MapsCollection.createFromDataAttribute(mapEl),
	user = User.createFromDataAttribute(mapEl, "data-user"),
	locations = LocationsCollection.createFromDataAttribute(mapEl, "data-locations");

	trip.setUser(user);
	trip.setMaps(maps);
	trip.setLocations(locations);

	var tripMap = new TripMap({
		el:mapEl,
		model:trip
	});

	tripMap.render().drawMaps().drawLocations();

	tripMap.on("location_mouseover", function (e) {
		var marker = e.marker;
		marker.model.setUser(marker.model.trip().user());
		var infoWindow = new LocationInfowindow({
			model:marker.model,
			map:tripMap.googleMap()
		});

		infoWindow.show();
	});

	tripMap.on("location_click", function (evt) {
		window.location.href = evt.marker.model.trip().url();
	});

	if( user.isCurrentUser() ) {

		var input = new FileInput({
			el:mapEl,
			input:document.getElementById("map-input-button"),
			dropTarget:document
		}).render(),
		loading = new Loading({
			el:document.body
		}).render(),
		editButton = document.getElementById("start-edit");
		input.setAllowedExtensions(["kml"]);

		if( editButton ) {
			editButton.addEventListener("click", function () {
				tripMap.startEdit();
				tripMap.on("marker_dragend", function (evt) {
					evt.marker.model.save({});
				})
			});
		}

		function loadMapForm(map) {
			var infoWindow = new google.maps.InfoWindow(),
			template = new AdminTemplate({
				id:"map_form",
				user:user,
				params: {
					map_id:map.get("slug"),
					user_id:user.get("slug"),
					trip_id:trip.get("slug")
				}
			});

			template.load({
				success:function (html) {
					var mapForm = new MapForm({
						el:html,
						model:map
					});
					infoWindow.setContent(html);
					infoWindow.setPosition(new google.maps.LatLng(map.get("start_lat"), map.get("start_lng")));
					infoWindow.open(tripMap.googleMap());
					mapForm.render();
					map.on("destroy", function () {
						infoWindow.open(null);
					})
				}
			});
		}

		tripMap.on("kml_click", function (e) {
			e.map.setTrip(trip);
			loadMapForm(e.map);
		});

		input.on("file_added", (function () {
			var geo;
			return function (event) {
				if( geo && geo.setMap ) { geo.setMap(null); }
				var map = new Map();
				
				map.setTrip(trip);
				map.attachFile(event.file);

				loading.setMessage("Parsing Map...")
				loading.loading();
		    	map.createWithXML({
		    		success:function (e) {
		    			var template = new AdminTemplate({
							id:"map_form",
							user:user,
							params: {
								map_id:map.get("slug"),
								user_id:user.get("slug"),
								trip_id:trip.get("slug")
							}
						});
						tripMap.drawMap(map)

		    			tripMap.on("kml_loaded", function (e) {
		    				if(e.map === map) {
		    					loadMapForm(e.map)
		    				}
		    			});

		    			loading.doneLoading();
		    		}
		    	})
			}
		})());	}

})