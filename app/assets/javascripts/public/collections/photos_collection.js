var PhotosCollection = Backbone.Collection.extend({
	model:Photo,

	_url: null,
	setUrl: function (url) {
		this._url = url;
	},
	url: function () {
		if (this._url !== null) {
			return this._url;
		}

		throw 'PhotosCollection has no url. Please specify a url';

	}

	
})