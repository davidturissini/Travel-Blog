window.addEventListener("DOMContentLoaded", function () {
	var dialog = new ModalDialog({
		onclose:function () {
			startHeighlight();
		}
	}),
	user = User.createFromDataAttribute(document.getElementById("user")),
	trip = Trip.createFromDataAttribute(document.getElementById("trip-photos")),
	highlightInterval;

	function highlightPhotos() {
		var numHighlighted = 0;
		[].forEach.call(document.getElementsByClassName("photo"), function (elem, index) {
			if( numHighlighted > (document.getElementsByClassName("photo").length / 3) || /highlighted/.test(elem.className) ) {
				elem.className = elem.className.replace(" highlighted", "");
				return;
			}
			if( Math.random() >= .6 ) {
				elem.className = elem.className += " highlighted";
				numHighlighted += 1;
			}
		});
	}

	function startHeighlight() {
		highlightInterval = setInterval(highlightPhotos, 5000);
	}

	function stopHighlight() {
		clearInterval(highlightInterval);
	}

	document.getElementById("trip-photos").addEventListener("mouseover", function () {
		stopHighlight();
	});

	document.getElementById("trip-photos").addEventListener("mouseout", function () {
		startHeighlight();
	});

	startHeighlight();

	[].forEach.call(document.getElementsByClassName("photo"), function (elem, index) {
		var photo = Photo.createFromDataAttribute(elem);
		elem.addEventListener("click", function () {
			var template = new Template({
				id:"photo_dialog",
				params: {
					trip_id:trip.get("slug"),
					user_id:user.get("slug"),
					photo_id:photo.get("slug")
				}
			});

			template.load({
				success:function (html) {
					dialog.setView(html);
					dialog.render();
				}
			})
			
		})
	})

	highlightPhotos();
});