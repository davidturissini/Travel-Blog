var UserLocationField = Backbone.View.extend({
	initialize:function () {
		var field = this;
		field.modal = new ModalDialog({
			parentElem:document.body
		});

		field.marker = new google.maps.Marker();
	},
	showMap: function () {
		var field = this, user = field.model, 
		template = new AdminTemplate({
			user:this.model,
			id:"user_location_field"
		});

		template.load({
			success:function (e) {
				field.dialogView = e;
				var mapElem = e.querySelector("figure");

			    field.modal.setView( e );
			    field.modal.setTitle("Select your home location");
			    field.modal.render();

			    field.map = new google.maps.Map(mapElem, {
			     zoom: 4,
			     center: new google.maps.LatLng(user.get("latitude") || 0, user.get("longitude") || 0),
			     mapTypeId: google.maps.MapTypeId.HYBRID
			    });
			    
			    if( user.get("latitude") != 0 && user.get("longitude") != 0 ) {
				    field.marker.setOptions({
					    position: new google.maps.LatLng(user.get("latitude"), user.get("longitude")),
					    map: field.map,
					    title: user.get("title")
			     	});
			    }

			    field._bindMapClicks();
			    field._bindSaveButtonClick();
			}
		})
	    
	},
	_bindSaveButtonClick:function () {
		var field = this,
		user = field.model,
		decoder = new GeocodeDecoder();

		field.dialogView.querySelector(".save").addEventListener("click", function () {
			decoder.decode(field.marker.position, {
				success:function (result) {
					if( result.data ) {
						var country = field.options.countries.findByName(result.data.country),
						country_id = country ? country.id : "";
						user.set({
							country_id: country_id,
							city:result.data.city || ""
						})
						user.save({}, {
							success:function () {
								field.modal.close();
							}
						});
					}
				}
			});
			
			user.set({
	           latitude: field.marker.position.lat(),
	           longitude: field.marker.position.lng()
	        });
	    })
	},
	_bindMapClicks: function () {
		var field = this,
		user = field.model;

		google.maps.event.addListener(field.map, "click", function (mapEvent) {
			field.marker.setOptions({
				map:field.map,
				position:mapEvent.latLng
			});
		})
	},
	render:function () {
		var field = this;

		field.model.on("change", function (e, options) {
			if( options.changes.country_id || options.changes.city ) {
				var country = field.options.countries.get(field.model.get("country_id"));
				field.el.innerHTML = field.model.get("city") + ", " + country.get("name");
			}
		});

		this.el.addEventListener("click", function (e) {
			field.showMap();
		});

		return field;
	}
})