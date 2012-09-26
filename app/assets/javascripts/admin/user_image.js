var UserImage = Backbone.View.extend({
	render:function () {
		var image = this, photo;
		this.model.on("change", function (model, options) {
			if( options.changes.photo_url ) {
				photo = UserPhoto.initFromUrl( image.model.get("photo_url") );
				image.el.setAttribute("src", photo.large());
			}
		})
	}
})