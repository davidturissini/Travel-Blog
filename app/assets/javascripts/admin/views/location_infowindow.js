var LocationInfoWindow = LocationInfoWindow.extend({
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
	bindDelete:function () {
		var view = this,
		del = _html.getElementsByClassName("location-delete").item(0);
		del.addEventListener("click", function (e) {
			e.preventDefault();
			if( confirm("Delete " + view.model.smartTitle() + "? This cannot be undone.") ) {
				view.model.destroy()
			}
		})
	}
})