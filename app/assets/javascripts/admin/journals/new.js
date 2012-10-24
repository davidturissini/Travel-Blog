window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-journals\-new\s/.test(document.body.className) ) { return }

	var journal = new Journal(),
	trip = Trip.createFromDataAttribute(document.getElementById('journal'), "data-trip");
	trip.setUser(TA.currentUser);
	journal.setTrip(trip);


	var form = new JournalForm({
		model:journal,
		saveButton:document.getElementById("journal-save"),
		titleField:document.getElementById("journal-title"),
		bodyField:document.getElementById("journal-body")
	});

	form.on("journal_save", function () {
		journal.save({}, {
			success:function () {
				window.location.href = journal.url();
			}
		});
	})

	form.render();

})