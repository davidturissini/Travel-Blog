var LocationInfowindow = Backbone.View.extend({
	_html:null,
	_infowindow:null,
	initialize:function () {
		this._isVisible = false;
	},
	infoWindow:function () {
		this._infowindow = this._infowindow || new google.maps.InfoWindow();
		return this._infowindow;
	},
	load:function (callbacks) {
		callbacks = callbacks || {};
		var view = this;
		if( this._html && callbacks._html ) {
			callbacks.success( this._html )
			return;
		}

		var template = new AdminTemplate({
			id:"location_infowindow",
			user:TA.currentUser,
			params:{
				location_id:view.model.id
			}
		})

		template.load({
			success:function (e) {
				view._html = e;
				if( callbacks.success ) {
					callbacks.success(e);
				}
				view.bindDelete();
				view.trigger("html_load", {html:e})

			}
		})
	},
	bindElements:function () {
		var view = this,
		title = this._html.getElementsByClassName("location-title").item(0);
		title.addEventListener("keyup", function (e) {
			view.model.set({title:e.currentTarget.value});
		})
		this.bindDelete();
		
	},
	bindDelete:function () {
		var view = this,
		del = this._html.getElementsByClassName("location-delete").item(0);
		del.addEventListener("click", function (e) {
			e.preventDefault();
			if( confirm("Delete " + view.model.smartTitle() + "? This cannot be undone.") ) {
				view.model.destroy()
			}
		})
	},
	show:function () {
		var view = this;
		this._isVisible = true;
		view.load({
			success:function (html) {
				view.infoWindow().setPosition(view.model.latLng());
				view.infoWindow().setContent(html);
				view.infoWindow().open(view.options.map);
			}
		})
	},
	toggle:function () {
		if( this._isVisible ) {
			this.hide();
		} else {
			this.show(); 
		}
	},
	hide:function () {
		this.infoWindow().setMap(null);
		this._isVisible = false;
	},
	render:function () {
		var view = this;
		this.model.on("destroy", function () {
			view.infoWindow().setMap(null);
		})
		return this;
	}
})