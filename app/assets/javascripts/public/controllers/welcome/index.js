window.addEventListener("DOMContentLoaded", function () {
	if( !/\welcome\-index\s/.test(document.body.className) ) { return }

	var heroEl = document.getElementById("hero"),
	time = new Date(heroEl.getAttribute("data-date")),
	kayak = new Kayak({
		iframe:document.getElementById("kayak-iframe"),
		defaults:{
			tab:"vacations"
		}
	});
	
	kayak.populate({
		l2:"New York",
		d2:"1/30/2013"
	});

})