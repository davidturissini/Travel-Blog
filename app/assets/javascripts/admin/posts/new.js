window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-posts\-new\s/.test(document.body.className) ) { return }

	var post = new Post(),
	trip = Trip.createFromDataAttribute(document.getElementById('post'), "data-trip");

	post.setUser(TA.currentUser);

	if(trip) {
		trip.setUser(TA.currentUser);
		post.setTrip(trip);
	}

	var form = new PostForm({
		model:post,
		saveButton:document.getElementById("post-save"),
		titleField:document.getElementById("post-title"),
		bodyField:document.getElementById("post-body")
	});

	form.on("post_save", function () {
		post.save({}, {
			success:function () {
				window.location.href = post.url();
			}
		});
	});

	var dateField = new DateField({
		el:document.getElementsByClassName("post-date").item(0),
		model:post
	});

	dateField.render();

	form.render();

})