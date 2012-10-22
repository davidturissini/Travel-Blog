var Location = Location.extend({
	editUrl:function () {
        return this.url();
    },
	editPhotosUrl:function () {
		return this.user.url({includeFormat:false}) + "/" + this.get("slug") + "/photos/edit";
	},
	newPhotosUrl:function () {
		return this.user.url({includeFormat:false}) + "/" + this.get("slug") + "/photos/new";
	}
})