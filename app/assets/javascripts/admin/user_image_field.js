var UserImageField = Backbone.View.extend({
	launchPhotoPicker: function () {
		var dialog = new ModalDialog(),
		template = new AdminTemplate({
			user:this.model,
			id:"user_picture_field"
		});

		template.load({
			success:function (e) {
				dialog.setView(e);
				dialog.render();
			}
		})

	},
	render:function () {
		var field = this;
		field.el.addEventListener("click", function (e) {
			field.launchPhotoPicker();
		});
	}
})