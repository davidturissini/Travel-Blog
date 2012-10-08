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
	getRaw:function (raw) {
		return this._raw;
	},
	setRaw:function (raw) {
		this._raw = raw;
	},
	url:function () {
		return this.location().url() + "/photos/" + this.get("slug")
	},
	setLocation:function (location) {
		this._location = location;
	},
	location:function () {
		return this._location;
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