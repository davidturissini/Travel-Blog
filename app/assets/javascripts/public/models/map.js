var Map = Backbone.Model.extend({
	attachFile:function (file) {
		this.file = file;
	},
	staticUrl:function () {
		if( this.isNew() && this.file ) {
	    	window.URL = window.URL || window.webkitURL;
 			return window.URL.createObjectURL(this.file)
		} else if ( !this.isNew() ) {
			return this.user.staticPath() + "maps/" + this.get("slug") + ".kml"
		}
	},
	readFile:function (callbacks) {
		if( !this.file ) { return }
		callbacks = callbacks || {};
		var map = this,
		reader = new FileReader();

		reader.onloadend = function (e) {
			if( callbacks.success ) {
				callbacks.success(e.target.result);
			}
		}

		reader.readAsText(this.file);
	},
	setUser:function (user) {
		this.user = user;
	},
	setLocation:function (location) {
		this.location = location;
		this.setUser(this.location.user);
	},
	saveWithXML:function (callbacks) {
		callbacks = callbacks || {};
		var map = this;
		this.readFile({
			success:function (fileData) {
				var attributes = map.attributes;
				attributes.xml = fileData;
				$.ajax({
					url:map.url(),
					type:"POST",
					data:{map:attributes},
					success:function (e) {
						map.set(e, {silent:true});
						if( callbacks.success ) {
							callbacks.success(e);
						}
					}
				})
			}
		})
	},
	url:function () {
		if( this.isNew() ) {
			return this.location.url() + "/maps/create";
		} else {
			return this.location.url() + "/maps/" + this.get("slug");
		}
	}
})

Map.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var json = JSON.parse( node.getAttribute(attributeName) );

    return new Map(json)
}