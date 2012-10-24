window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-journals\-edit\s/.test(document.body.className) ) { return }

	var journal = Journal.createFromDataAttribute(document.getElementById("journal")),
	trip = Trip.createFromDataAttribute(document.getElementById('journal'), "data-trip");
	trip.setUser(TA.currentUser);
	journal.setTrip(trip);

	new AutoSaveTextField({
		model:journal,
		el:document.getElementById("journal-title"),
		property:"title"
	}).render();

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