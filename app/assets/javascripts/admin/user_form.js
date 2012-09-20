

var UserForm = Backbone.View.extend({
	initialize: function () {
		var form = this
		form.modal = new ModalDialog({
			parentElem:form.el
		})

		form.marker = new google.maps.Marker()

		form.model.on("change", function (model, options) {
			if( options.changes.photo_url ) {
				var image = form.el.querySelector("#user-photo img")
				image.setAttribute("src", model.get("photo_url"))
			}

			if( options.changes.latitude || options.changes.longitude ) {
				form.marker.setPosition(new google.maps.LatLng(user.get("latitude"), user.get("longitude")) )
			}
		})


	    
	},
	showMap: function () {
	    var mapElem = document.createElement("figure"),
	    form = this,
	    loc = this.model
	    mapElem.className = "map"

	    form.modal.setView( mapElem )
	    form.modal.setTitle("Select your home location")
	    form.modal.render()

	    form.map = new google.maps.Map(mapElem, {
	     zoom: 4,
	     center: new google.maps.LatLng(loc.get("latitude"), loc.get("longitude")),
	     mapTypeId: google.maps.MapTypeId.HYBRID
	    })
	    
	    form._bindMapClicks()
	    form.marker.setOptions({
		    position: new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude")),
		    map: form.map,
		    title: this.model.get("title")
     	})
	    
	},
	_bindMapClicks: function () {
		var form = this,
		decoder = new GeocodeDecoder()
		google.maps.event.addListener(form.map, "click", function (mapEvent) {
			decoder.decode(mapEvent.latLng, {
				success:function (result) {
					if( result.data ) {
						var country = form.countryField.collection.findByName(result.data.country),
						country_id = country ? country.id : ""
						user.set({
							country_id: country_id,
							city:result.data.city || ""
						})
					}
				}
			})
			
			user.set({
	           latitude: mapEvent.latLng.lat(),
	           longitude: mapEvent.latLng.lng()
	        })
		})
	},
	render: function () {
		var form = this,
		user = form.model,
		decoder = new GeocodeDecoder(),
		countryList = new CountryCollection();

		[].forEach.call(["photo_url", "name"], function (field) {
			form.el.getElementsByClassName("user-" + field).item(0).addEventListener("change", function (e) {
				user.set(field, e.currentTarget.value)
			})
		})

		form.cityField = new CityField({
			model:user,
			input: document.getElementById("user-city")
		}).render()

		form.countryField = new CountryField({
			el: form.el.querySelector(".user-countries-field"),
			map:form.options.map,
			model:user,
			input: document.getElementById("user-country_id"),
      		textElem: document.getElementById("user-country"),
      		collection:countryList
		}).render();

		

		form.el.querySelector(".show-map").addEventListener("click", function () {
	      	form.showMap()
	    })
		
		form.el.addEventListener("submit", function (e) {
		    e.preventDefault()
		    user.isCurrentUser = true
		    user.jsonPrefix = true
		    user.save({}, {
			    success:function () {
			        window.location.reload()
			    }
		    })
		})


		return this
	}
})