function GeocodeDecoder () {
	var geocoder = new google.maps.Geocoder()

	this.decode = function ( latLng, callbacks ) {
		callbacks = callbacks || {}
		geocoder.geocode({latLng:latLng}, function (e, status) {
			if( e ) {
				var data = __parse( e )
				if( callbacks.success ) {
					callbacks.success({
						data:data,
						geoString:function () {
				    		if( data.city && data.state && data.country ) {
								return data.city + ", " + data.state + ", " + data.country;
							} else if( data.city && data.country) {
								return data.city + ", " + data.country;
							} else if( data.state && data.country ) {
								return data.state + ", " + data.country;
							} else if ( data.country ) {
								return data.country
							}
				    	}
					})
				}
			}
			return false
		})

	}

	function __parse (results) {
	   	var city,
		state,
		country,
		result = results[0]
		if( !result ) {
			return {
				country: "",
				state: "",
				city: ""
			}
		}
		results[0].address_components.forEach(function (obj) {
			obj.types.forEach(function (type) {
				if( type == "locality" ) {
					city = obj.long_name
				} else if ( type == "administrative_area_level_1" ) {
					state = obj.long_name
				} else if ( type == "country" ) {
					country = obj.long_name
				}
			})
		})
		
	    return {
	    	city:city,
	    	state:state,
	    	country:country
	    }  		
	}

	return this
}