//= require_tree .

window.TA = window.TA || {};

window.addEventListener("DOMContentLoaded", function () {
	var userLocationButtons = document.getElementsByClassName("user-location-button"), 
	countryList = new CountryCollection();

	TA.currentUser = new User( JSON.parse( YAHOO.util.Cookie.get("user") ));

	function renderUserLocationButtons(elems) {
		var i = 0;
		for(i; i < userLocationButtons.length; i++) {
			new UserLocationField({
				model:TA.currentUser,
				el:userLocationButtons[i],
				countries:countryList
			}).render()
		}
	};

	countryList.fetch({
		success:function () {
			renderUserLocationButtons(userLocationButtons)
		}
	})

})