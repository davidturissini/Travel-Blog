window.addEventListener("DOMContentLoaded", function () {
	if( !/\welcome\-index\s/.test(document.body.className) ) { return }

	var k = new Kayak({
		iframe:document.getElementById("kayak-iframe")
	});
	
	k.populateFlightSearch();

})