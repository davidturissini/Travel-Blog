window.addEventListener("DOMContentLoaded", function () {
	if( !/\welcome\-index\s/.test(document.body.className) ) { return }

	var heroEl = document.getElementById("hero"),
	time = new Date(heroEl.getAttribute("data-date")),
	kayak = new Kayak({
		el:document.getElementById("kayak"),
		iframe:document.getElementById("kayak-iframe"),
		defaults:{
			tab:"flights"
		}
	});

	kayak.render();

	var view = new Hero({
		el:heroEl,
		elements:heroEl.getElementsByClassName("hero-link")
	});

	view.render();
	
	kayak.populate({
		l2:"New York"
	});

})