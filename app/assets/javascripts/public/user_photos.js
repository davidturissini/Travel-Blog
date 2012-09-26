var UserPhoto = {
	init:function( options ) {
		switch(options.service.toLowerCase()) {
			case "facebook":
				return new FacebookUserPhoto(options);
				break;
			case "gravatar":
				return new GravatarUserPhoto(options);
				break;
		}
	},
	initFromUrl:function (url) {
		var photo;

		if( /facebook\.com/.test(url) ) {
			photo = new FacebookUserPhoto();
			photo.setUrl(url);
		} else if( /gravatar\.com/.test(url) ) {
			photo = new GravatarUserPhoto();
			photo.setUrl(url);
		}

		return photo;
	}
}

var FacebookUserPhoto = function (options) {
	var photo = this, __url;
	options = options || {}

	if( options.serviceId ) {
		__url = "https://graph.facebook.com/" + options.serviceId + "/picture";
	}

	photo.url = function () {
		return __url;
	}

	photo.large = function () {
		return photo.url() + "?type=large";
	}

	photo.setUrl = function (url) {
		__url = url;
	}

	return photo;
}

var GravatarUserPhoto = function (options) {
	var photo = this, __url;
	options = options || {}

	photo.url = function () {
		return __url;
	}

	photo.large = function () {
		return photo.url() + "?s=200";
	}

	photo.setUrl = function (url) {
		__url = url;
	}

	if( options.serviceId ) {
		photo.setUrl("http://www.gravatar.com/avatar/" + hex_md5(options.serviceId));
	}


	return photo;
}