var Map = Backbone.Model.extend({
	attachFile:function (file) {
		this.file = file;
	},
	staticUrl:function () {
		if( this.isNew() && this.file ) {
	    	window.URL = window.URL || window.webkitURL;
 			return window.URL.createObjectURL(this.file)
		} else if ( !this.isNew() ) {
			return "/user_static/" + this.user.get("slug") + "/maps/" + this.get("slug") + ".kml"
		}
	},
	saveTmp:function(callbacks) {
		if( !this.file ) { return }
		callbacks = callbacks || {};
		var map = this,
		reader = new FileReader();

		reader.onloadend = function (e) {
			$.ajax({
				url:map.location.url() + "/maps/save_tmp",
				type:"POST",
				data: {
					map:e.target.result
				},
				success:function (e) {
					if( callbacks.success ) {
						callbacks.success(e);
					}
				}
			})
		}

		reader.readAsText(this.file);
	},
	setUser:function (user) {
		this.user = user;
	},
	setLocation:function (location) {
		this.location = location;
		this.user = this.location.user;
	},
	url:function () {
		if( this.isNew() ) {
			return this.location.url() + "/maps/" + this.get("slug");
		} else {
			return this.location.url() + "/maps/" + this.get("slug");
		}
	}
})