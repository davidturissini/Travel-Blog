var CountryField = Backbone.View.extend({
	initialize: function () {
		var field = this
		this.model.on("change", function (model, options) {
		    if( options.changes.country ) {
			    var country = this.get("country"),
			    country_id = country.get("id")
			    field.options.textElem.innerHTML = country.get("name")

			    this.set({country:null, country_id:country_id}, {silent:true})
			    field._updateFormField()
		    }
	    })
	},
	_updateFormField:function () {
      	var model = this.model,
		newVal = model.get("location_id"),
		elem = this.options.input
		if( elem.value != newVal) {
		  elem.value = newVal
		}
   	},
	render: function () {
		var field = this,
		model = field.model
		countryList = new CountryCollection(),
		geocoder = new google.maps.Geocoder();
	    countryList.fetch({
	        success:function (countries) {
				google.maps.event.addListener(field.options.map, "click", function (mapEvent) {
					geocoder.geocode({latLng:mapEvent.latLng}, function (e) {
				        var country = (function () {
				           	for(var i in e) {
				            	if( e[i].types[0] == "country" ) { 
				             		var countryName = e[i].formatted_address
				              		return countries.where({name:countryName})[0]
				            	}
				           	}
				        })()

			          	model.set({
			          		country:country
			        	})
				    })
				})
				field.trigger("ready")
			}
		})
	}
})