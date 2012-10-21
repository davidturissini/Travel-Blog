var TripPhotoDialog = ModalDialog.extend({
	bindImageClicks:function () {
		var view = this;
		[].forEach.call(this.view.getElementsByClassName("photo"), function (elem) {
			var photo = Photo.createFromDataAttribute(elem);
			photo.setUser(view.model.user());
			elem.addEventListener("click", function () {
				view.trigger("photo_click", {photo:photo});
			})
		});
	},
	render:function () {
		var dialog = this,
		template = new AdminTemplate({
			user:TA.currentUser,
			id:"trip_photos",
			params:{
				trip_id:dialog.model.get("slug")
			}
		})
		dialog.setTitle("Select photo for " + dialog.model.toString());
		template.load({
			success:function (html) {
				dialog.setView(html);
				dialog.bindImageClicks();
				ModalDialog.prototype.render.call(dialog);
			}
		})

		return dialog;
	}
})