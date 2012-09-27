var UserImage = Backbone.View.extend({
	determinePhotoUrl: function (photo) {
		var method = this.el.getAttribute("data-photo-size") || "url";
		return photo[method]();
	},
	render:function () {
		var image = this, photo;
		this.model.on("change", function (model, options) {
			if( options.changes.photo_url ) {
				photo = UserPhoto.initFromUrl( image.model.get("photo_url") );

				var url = image.determinePhotoUrl(photo);

				image.el.setAttribute("src", url);
			}
		})
	}
})