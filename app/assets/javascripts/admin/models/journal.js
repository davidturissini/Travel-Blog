var Journal = Journal.extend({
	url:function () {
		if( this.isNew() ) {
			return this.trip().url() + "/journal";
		} else {
			return this.trip().url() + "/journal/" + this.get("slug");
		}
	}
})