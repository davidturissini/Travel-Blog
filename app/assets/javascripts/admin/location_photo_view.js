var LocationPhotoView = Backbone.View.extend({
	render:function () {
		var view = this,
		image = this.el.getElementsByTagName("img")[0];

		this.model.on("change", function (options, changed) {
			if( changed.changes.photo_id ) {
				var photo = view.model.photo();
				image.setAttribute("src", photo.source());
			}
		})
	}
})