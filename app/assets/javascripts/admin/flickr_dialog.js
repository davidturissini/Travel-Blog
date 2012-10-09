var FlickrDialog = ModalDialog.extend({
	__bindFlickrClicks:function () {
		var dialog = this,
		flickrPhotoSetLinks = this.view.getElementsByClassName("flickr-set");

		for(var i = 0; i < flickrPhotoSetLinks.length; i += 1) {
			var link = flickrPhotoSetLinks[i];
			link.addEventListener("click", function (evt) {
			  dialog.close();
			  dialog.trigger("photoset_click", {photoset:JSON.parse( evt.currentTarget.getAttribute("data-set") )})
			})
		}
	},
	render:function () {
		var dialog = this;
		var flickrTemplate = new AdminTemplate({
            id:"flickr_photos",
            user:TA.currentUser
        });

		flickrTemplate.load({
            success:function (html) {
				dialog.setView( html );
				dialog.setTitle("Import photos from flickr");
				dialog.__bindFlickrClicks();

				ModalDialog.prototype.render.call(dialog);
            }
        });

        return this;
	}
})