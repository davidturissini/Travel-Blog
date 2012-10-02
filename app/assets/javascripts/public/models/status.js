var Status = Backbone.Model.extend({
    setUser: function (user) {
        this.user = user
    },
	jsonPrefix: true,
	 toJSON: function () {
	  if( this.jsonPrefix ) {
	    return { status: this.attributes}
	  } else {
	    return this.attributes
	  }
	 },
	url:function () {
		if( this.isNew() ) {
			return this.user.url({includeFormat:false}) + "/statuses"
		} else {
			return this.user.url({includeFormat:false}) + "/statuses/" + this.id;
		}
	},
	setUser:function ( user ) {
		this.user = user;
	},
	setLocation:function ( location ) {
		if( !location.isNew() ) {
			this.set({location_id:location.id})
		}
		this.location = location;
	},
	clearLocation:function () {
		this.location = null
		this.set({location_id:null})
	}
})

Status.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var json = JSON.parse( node.getAttribute(attributeName) );

    return new Status(json)
}