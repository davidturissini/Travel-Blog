window.addEventListener("DOMContentLoaded", function () {
	if( !/welcome\-index\s/.test(document.body.className) ) { return }

	[].forEach.call(document.getElementsByClassName("trip"), function (elem) {
		var trip = Trip.createFromDataAttribute(elem),
		remove = elem.getElementsByClassName("remove").item(0);

		trip.setUser(TA.currentUser);

		remove.addEventListener("click", function (e) {
			if( confirm("Delete " + trip.get("title") + "? This cannot be undone") ) {
				trip.destroy({
					success:function () {
						elem.parentNode.removeChild(elem);
					}
				})
			}
		})
	})
})