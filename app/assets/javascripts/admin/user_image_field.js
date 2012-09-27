var UserImageField = Backbone.View.extend({
	__bindServiceClicks:function () {
		var field = this, i, elems = field.dialogView.getElementsByTagName("li"), elem;

		for(i = 0; i < elems.length; i++) {
			elem = elems[i];
			elem.addEventListener("click", function (e) {
				var service = e.currentTarget.getAttribute("data-service"),
				serviceId = e.currentTarget.getAttribute("data-service_id");

				if( service != "gravatar" ) {
					field.setImageSource({
						service:service,
						serviceId:serviceId
					});
				} else if ( service == "gravatar" ) {
					field.showEmailField();
				}

			})
		}
	},
	showEmailField: function () {
		var field = this,
		gravatar = field.dialogView.querySelector(".gravatar"),
		emailInput = field.dialogView.querySelector(".email");
		gravatar.className += " expanded";
		field.dialogView.querySelector(".button").addEventListener("click", function (e) {
			e.preventDefault();
			e.stopPropagation();
			gravatar.className = gravatar.className.replace(" expanded", "");
			field.setImageSource({
				service:"gravatar",
				serviceId:field.dialogView.querySelector(".email").querySelector("input[type=email]").value
			});
		});
	},
	setImageSource: function ( options ) {
		var field = this,
		photo = UserPhoto.init({
			service:options.service,
			serviceId:options.serviceId
		});

		field.userImage.setAttribute("src", photo.large());
		field.model.set({photo_url: photo.url()});

	},
	launchPhotoPicker: function () {
		var field = this,
		template = new AdminTemplate({
			user:this.model,
			id:"user_picture_field"
		});

		field.dialog = new ModalDialog({
			onclose:function () {
				field.dialogClose();
			}
		});

		template.load({
			success:function (e) {
				field.dialogView = e;
				field.dialog.setView(field.dialogView);
				field.dialog.render();
				field.userImage = field.dialogView.querySelector(".user-image img");
				field.userImage.addEventListener("load", function () {
					field.dialog.autocenter();
				})


				field.dialogView.querySelector(".save").addEventListener("click", function () {
					field.model.save({}, {
						success:function () {
							field.__didSave = true;
							field.dialog.close();
						}
					})
				})

				field.__bindServiceClicks()
			}
		})

	},
	dialogClose:function () {
		if( this.__didSave === true ) { return }
		this.model.set({
			photo_url:this.__originalUserPhoto
		});
	},
	render:function () {
		var field = this;

		field.__originalUserPhoto = this.model.get("photo_url");
		field.el.addEventListener("click", function (e) {
			field.launchPhotoPicker();
		});

	}
})