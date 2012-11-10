var Journal = Journal.extend({
	url:function () {
		if( this.isNew() ) {
			return this.trip().url() + "/journals";
		} else {
			return this.trip().url() + "/journals/" + this.get("slug");
		}
	}
})