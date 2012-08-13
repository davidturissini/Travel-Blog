var CityField = Backbone.View.extend({
	initialize: function () {
		var field = this,
		model = field.model

		model.on("change", function (e, options) {
	        if( options.changes.city ) {
	        	field._updateFormField()
	        } 
	    })

	    field.options.input.addEventListener("change", function (e) {
	       model.set("city", e.currentTarget.value)
	    })
	},
	_updateFormField:function () {
      	var model = this.model,
		newVal = model.get("city"),
		elem = this.options.input
		if( elem.value != newVal) {
		  elem.value = newVal
		}
   	},
	render: function () {
		var field = this,
		model = field.model
		geocoder = new google.maps.Geocoder();

		google.maps.event.addListener(field.options.map, "click", function (mapEvent) {
         geocoder.geocode({latLng:mapEvent.latLng}, function (e) {
          var address = (function () {
           var hash
           for(var i in e) {
            if( e[i].types[0] == "locality" ) {
             hash = e[i]
            }
          }
          if( hash ) { 
           return hash.formatted_address 
          }
          })(), city
          if( address ) {
           city = address.split(",")[0]
          }

          model.set({
           	city:city || ""
           })

         })
        })
        return this
	}
})