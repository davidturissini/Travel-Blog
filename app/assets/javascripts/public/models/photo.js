var Photo = Backbone.Model.extend({
	initialize:function (attributes) {
		if( !attributes ) { return }
		if( attributes.constructor === File ) {
			this.setRaw( attributes );
		} else if( attributes.constructor === Image ) {
			this.setRaw( attributes );
		}
	},
	__getBinaryFromElement:function () {
		var canvas = document.createElement("canvas"),
      	ctx = canvas.getContext("2d");
      	canvas.width = this.getRaw().width;
      	canvas.height = this.getRaw().height;
      	ctx.drawImage(this.getRaw(), 0, 0);
      	return false;
      	return canvas.toDataURL('image/jpeg');
	},
	setUser:function (user) {
		this._user = user;
	},
	user:function () {
		return this._user;
	},
	proportion:function () {
		return this.get("width") / this.get("height");
	},
	proportionHeight:function ( width ) {
		return this.proportion() * width;
	},
	src:function () {
		if( this.getRaw() ) {
			if( this.getRaw().src ) {
			 	return this.getRaw().src;
			 } else {
			 	window.URL = window.URL || window.webkitURL;
			  	return window.URL.createObjectURL(this.getRaw());
			 }
		}
	},
	source:function () {
		return this.user().staticPath() + "photos/500/" + this.get("slug") + ".jpg";
	},
	getRaw:function (raw) {
		return this._raw;
	},
	setRaw:function (raw) {
		this._raw = raw;
	},
	url:function () {
		return this.trip().url() + "/photos/" + this.get("slug");
	},
	setTrip:function (trip) {
		this._trip = trip;
	},
	trip:function () {
		return this._trip;
	},
	getBinary:function ( callbacks ) {
		callbacks = callbacks || {}
		if( this.getRaw().constructor === Image ) {
			if( callbacks.success ) {
				callbacks.success( this.__getBinaryFromElement() );
			}
		} else if ( this.getRaw().constructor === File ) {
			var reader = new FileReader();

			reader.onload = function (f) {
				if( callbacks.success ) {
					callbacks.success(f.target.result);
				}
			}

			reader.readAsDataURL( this.getRaw() );
		}
	}
})


Photo.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var json = JSON.parse( node.getAttribute(attributeName) );

    return new Photo(json)
}