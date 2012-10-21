window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-locations\-new\s/.test(document.body.className) ) { return }

	var location = new Location(),
	locMap = new LocationMap({
		model:location,
		el:document.getElementById("google-map")
	});

	locMap.render();
	locMap.startEdit();

	document.getElementById("location-title").addEventListener("keyup", function(e) {
		location.set({title:e.currentTarget.value});
	})



	document.getElementById("location-save").addEventListener("click", function (e) {
		e.preventDefault();
		location.save({}, {
			success:function (e) {
				window.location.href = location.editPath();
			}
		})
	})

})