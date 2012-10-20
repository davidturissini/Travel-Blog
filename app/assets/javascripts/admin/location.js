var Location = Location.extend({
	editPhotosUrl:function () {
		return this.user.url({includeFormat:false}) + "/" + this.get("slug") + "/photos/edit";
	},
	newPhotosUrl:function () {
		return this.user.url({includeFormat:false}) + "/" + this.get("slug") + "/photos/new";
	},
	mapsUrl:function () {
		return this.url() + "/maps";
	}
})