//= require_tree .


window.addEventListener("DOMContentLoaded", function () {
	var userLocationButtons = document.getElementsByClassName("user-location-button"), 
	userImageButtons = document.getElementsByClassName("user-image-button"),
	userImages = document.getElementsByClassName("user-image"),
	countryList = new CountryCollection(),
	i;

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
	});

	for(i = 0; i < userImageButtons.length; i++) {
		new UserImageField({
			el:userImageButtons[i],
			model:TA.currentUser
		}).render()
	};

	for(i = 0; i < userImages.length; i++) {
		new UserImage({
			el:userImages[i],
			model:TA.currentUser
		}).render();
	}

})