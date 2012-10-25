window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-journals\-edit\s/.test(document.body.className) ) { return }

	var journalElem = document.getElementById('journal'),
	journal = Journal.createFromDataAttribute(journalElem),
	trip = Trip.createFromDataAttribute(document.getElementById('journal'), "data-trip");
	trip.setUser(TA.currentUser);
	journal.setTrip(trip);

	journal.set({
		body:document.getElementById("journal-body").innerHTML
	}, {silent:true});
	
	new AutoSaveTextField({
		model:journal,
		el:document.getElementById("journal-title"),
		property:"title"
	}).render();

	var dateField = new DateField({
		el:document.getElementById("journal-dates"),
		model:journal
	});

	dateField.render();

	journal.on("change", function (e, changed) {
		if( changed.changes.start_date || changed.changes.end_date ) {
			journal.save({})
		}
	})
	

	tinyMCE.init({
        mode:"textareas",
        theme: "advanced",
        theme_advanced_buttons1 : "bold,italic,underline,|,link,unlink,|,bullist,blockquote,undo",
        setup:function (ed) {
        	ed.onKeyUp.add((function () {
        		var timeout;
        		return function(ed, l) {
        			if( timeout ) { clearTimeout(timeout); }
        			setTimeout(function () {
		        		journal.save({
		        			body:ed.getContent()
		        		})
		        	}, 500);
	        	}
        	})())
        }
	});

})