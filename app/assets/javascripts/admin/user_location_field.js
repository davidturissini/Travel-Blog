var UserLocationField = Backbone.View.extend({
	initialize:function () {
		var field = this;
		field.modal = new ModalDialog({
			parentElem:document.body
		});

		field.marker = new google.maps.Marker();
	},
	showMap: function () {
	    var mapElem = document.createElement("figure"),
	    field = this,
	    user = this.model;
	    mapElem.className = "map";

	    field.modal.setView( mapElem );
	    field.modal.setTitle("Select your home location");
	    field.modal.render();

	    field.map = new google.maps.Map(mapElem, {
	     zoom: 4,
	     center: new google.maps.LatLng(user.get("latitude") || 0, user.get("longitude") || 0),
	     mapTypeId: google.maps.MapTypeId.HYBRID
	    });
	    
	    field._bindMapClicks()
	    field.marker.setOptions({
		    position: new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude")),
		    map: field.map,
		    title: this.model.get("title")
     	});
	    
	},
	_bindMapClicks: function () {
		var field = this,
		decoder = new GeocodeDecoder(),
		user = field.model;

		google.maps.event.addListener(field.map, "click", function (mapEvent) {
			decoder.decode(mapEvent.latLng, {
				success:function (result) {
					if( result.data ) {
						var country = field.options.countries.findByName(result.data.country),
						country_id = country ? country.id : ""
						user.set({
							country_id: country_id,
							city:result.data.city || ""
						})
						user.save();
					}
				}
			});
			
			user.set({
	           latitude: mapEvent.latLng.lat(),
	           longitude: mapEvent.latLng.lng()
	        });
		})
	},
	render:function () {
		var field = this;

		this.el.addEventListener("click", function (e) {
			field.showMap();
		});

		return field;
	}
})