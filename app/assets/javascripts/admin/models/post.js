var Post = Post.extend({
	url:function () {
		if( this.isNew() ) {
			return this.user().url() + "/posts";
		} else {
			return this.user().url() + "/posts/" + this.get("slug");
		}
	}
})