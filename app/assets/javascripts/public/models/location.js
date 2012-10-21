var Location = Backbone.Model.extend({
    editPath:function () {
        return this.url() + "/edit";
    },
    url: function () {
        var str = this.user.url({includeFormat:false});
        if( this.isNew() ) { 
            str += "/locations/create";
        } else {
            str += "/" + this.get("slug"); 
        }
        return str;
    },
    latLng:function () {
        return new google.maps.LatLng(this.get("latitude") || 40.7142, this.get("longitude") || -74.0064)
    },
    jsonPrefix: false,
    toJSON: function () {
        if( this.jsonPrefix ) {
            return {location:this.attributes}
        } else {
            return this.attributes 
        }
    },
    geoString:function ( options ) {
        options = options || {}
        var data = this;
        if( data.get("title") && options.includeTitle !== false ) {
            return data.get("title");
        } else if( data.get("city") && data.get("state") ) {
            return data.get("city") + ", " + data.get("state");
        } else if( data.get("city") && data.country.get("name") ) {
            return data.get("city") + ", " + data.country.get("name");
        } else if( data.get("state") && data.country ) {
            return data.get("state") + ", " + data.country.get("name");
        } else if ( data.country ) {
            return data.country.get("name")
        }
    },
    loadCountry:function ( callbacks ) {
        var location = this;
        callbacks = callbacks || {};

        TA.countries.fetch({
            success:function (countries) {
                if( location.get("country_id") ) {
                    var country = countries.get(location.get("country_id"));
                    location.setCountry(country, {silent:true});
                }
                if( callbacks.success ) {
                    callbacks.success(country);
                }
            }
        })
    },
    setCountry: function (country, options) {
        options = options || {};
        this.country = country;
        this.set({country_id:country.id}, options);
    },
    setUser: function (user) {
        this.user = user
    },
    setLocationType: function (locType) {
        this.locationType = locType
        this.setUser(locType.user)
    },
    hasLatLng: function () {
        return this.has("latitude") && this.has("longitude")
    }
})

Location.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var json = JSON.parse( node.getAttribute(attributeName) );

    return new Location(json)
}