window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-posts\-index\s/.test(document.body.className) ) { return }

	var trip = Trip.createFromDataAttribute(document.getElementById("journals"), "data-trip");
	trip.setUser(TA.currentUser);
	[].forEach.call(document.getElementsByClassName("journal"), function (journalElem) {
		var journal = Journal.createFromDataAttribute(journalElem),
		dateEl = journalElem.getElementsByClassName("date-field").item(0),
		titleEl = journalElem.getElementsByClassName("journal-title").item(0),
		removeEl = journalElem.getElementsByClassName("remove").item(0);

		journal.setTrip(trip);

		new DynamicTextarea({
	        el:titleEl
	    }).render();

		new AutoSaveTextField({
			el:titleEl,
			model:journal,
			property:"title"
		}).render();

		new DateField({
			el:dateEl,
			model:journal,
			autoUpdate:true
		}).render();

		removeEl.addEventListener("click", function () {
			if( confirm("Delete " + journal.get("title") + "? This cannot be undone") ) {
				journal.destroy({
					success:function () {
						journalElem.parentNode.removeChild(journalElem);
					}
				})
			}
		})

	});
	
})