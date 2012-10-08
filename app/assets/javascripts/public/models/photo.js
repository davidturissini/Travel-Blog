var Photo = Backbone.Model.extend({
	initialize:function (attributes) {
		if( attributes.constructor === File ) {
			this.raw = attributes;
		} else if( attributes.constructor === Image ) {
			this.raw = attributes;
			this.set({
				url:attributes.src
			})
		}
	},
	__getBinaryFromElement:function () {
		var canvas = document.createElement("canvas"),
      	ctx = canvas.getContext("2d");
      	canvas.width = this.raw.width;
      	canvas.height = this.raw.height;
      	ctx.drawImage(this.raw, 0, 0);
      	return false;
      	return canvas.toDataURL('image/jpeg');
	},
	src:function () {
		if( this.has("src") ) {
		 	return this.get("src")
		 } else {
		 	window.URL = window.URL || window.webkitURL;
		  	return window.URL.createObjectURL(this.raw);
		 }
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
		if( this.raw.constructor === Image ) {
			if( callbacks.success ) {
				callbacks.success( this.__getBinaryFromElement() );
			}
		} else if ( this.raw.constructor === File ) {
			var reader = new FileReader();

			reader.onload = function (f) {
				if( callbacks.success ) {
					callbacks.success(f.target.result);
				}
			}

			reader.readAsDataURL( this.raw );
		}
	}
})