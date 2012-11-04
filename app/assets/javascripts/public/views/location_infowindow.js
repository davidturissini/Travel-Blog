var LocationInfowindow = Backbone.View.extend((function () {
	var _html, _infowindow,
	_isVisible = false;
	return {
		infoWindow:function () {
			_infowindow = _infowindow || new google.maps.InfoWindow();
			return _infowindow;
		},
		bindElements:function () {
			var view = this,
			title = _html.getElementsByClassName("location-title").item(0);
			title.addEventListener("keyup", function (e) {
				view.model.set({title:e.currentTarget.value});
			})
			
		},
		load:function (callbacks) {
			callbacks = callbacks || {};
			var view = this;
			if( this._html && callbacks._html ) {
				callbacks.success( this._html )
				return;
			}

			var template = new Template({
				id:"location_infowindow",
				user:view.model.user(),
				params:{
					trip_id:view.model.id
				}
			})

			template.load({
				success:function (e) {
					view._html = e;
					if( callbacks.success ) {
						callbacks.success(e);
					}
					view.trigger("html_load", {html:e})

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
			_isVisible = false;
		},
		render:function () {
			var view = this;
			this.model.on("destroy", function () {
				view.infoWindow().setMap(null);
			})
			return this;
		}
	}
})());