window.addEventListener("DOMContentLoaded", function () {
	if( !/\sphotos\-index\s/.test(document.body.className) ) { return }
	var dialog = new ModalDialog({}),
	user = User.createFromDataAttribute(document.getElementById("user")),
	trip = Trip.createFromDataAttribute(document.getElementById("trip-photos"));

	trip.setUser(user);


	[].forEach.call(document.getElementsByClassName("photo"), function (elem, index) {
		var photo = Photo.createFromDataAttribute(elem);
		photo.setUser(user);
		photo.setTrip(trip);
		elem.addEventListener("click", function () {
			var template = new Template({
				id:"photo_dialog",
				params: {
					trip_id:trip.get("slug"),
					user_id:user.get("slug"),
					photo_id:photo.get("slug")
				}
			});

			if( user.isCurrentUser() ) {
				photo.on("change", function (model, changes) {
					if( changes.changes.title ) {
						elem.getElementsByTagName("h1").item(0).innerHTML = model.get("title");
					} 
				})
			}

			dialog.loading("Loading photo");

			template.load({
				success:function (html) {
					var img = new Image();
					img.onload = function () {
						dialog.setView(html);
						dialog.autocenter();

						if( user.isCurrentUser() ) {
							var form = new PhotoForm({
								model:photo,
								el:html
							});

							form.on("removed", function () {
								elem.parentNode.removeChild(elem);
								dialog.close();
								photo.destroy()

							});

							form.render();
						}
					}

					img.src = html.getElementsByTagName("img").item(0).getAttribute("src");
					
				}
			})
			
		})
	});
});