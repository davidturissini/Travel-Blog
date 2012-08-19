

var UserForm = Backbone.View.extend({
	initialize: function () {
		var form = this
		form.userMarker = new google.maps.Marker()
		form.userMarker.setMap(form.options.map)

		form.model.on("change", function (model, options) {
			if( options.changes.photo_url ) {
				var image = form.el.querySelector("#user-photo img")
				image.setAttribute("src", model.get("photo_url"))
			}

			if( options.changes.slug ) {
				var mirror = form.el.querySelector(".slug-mirror")
				mirror.innerHTML = model.get("slug")
			}

			if( options.changes.latitude || options.changes.longitude ) {
				form.setMapCenter()
			}
		})
	},
	setMapCenter: function () {
		var form = this
		map.setCenter(this.model.latLng())
        form.userMarker.setPosition(this.model.latLng())
	},
	render: function () {
		var form = this,
		user = form.model,
		decoder = new GeocodeDecoder(),
		countryList = new CountryCollection();

		[].forEach.call(["slug", "photo_url"], function (field) {
			form.el.getElementsByClassName("user-" + field).item(0).addEventListener("change", function (e) {
				user.set(field, e.currentTarget.value)
			})
		})

		countryList.fetch({
			success: function (countries) {
				var cityField = new CityField({
					model:user,
					input: document.getElementById("user-city")
				}).render()

				var countryField = new CountryField({
					map:form.options.map,
					model:user,
					input: document.getElementById("user-country_id"),
		      		textElem: document.getElementById("user-country"),
		      		collection:countryList
				}).render();

				google.maps.event.addListener(form.options.map, "click", function (mapEvent) {
					decoder.decode(mapEvent.latLng, {
						success:function (result) {
							if( result.data ) {
								var country = countries.where({name:result.data.country})[0]
								user.set({
									country_id: country.id,
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
			}
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

		form.setMapCenter()

		return this
	}
})