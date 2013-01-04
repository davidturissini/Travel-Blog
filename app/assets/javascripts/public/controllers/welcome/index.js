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

	var view = new Hero({
		el:heroEl,
		elements:heroEl.getElementsByClassName("hero-link")
	});

	view.render();

	var i = 0;
	setInterval(function () { 
		view.showNext();
	}, 5000);
	
	kayak.populate({
		l2:"New York"
	});

})