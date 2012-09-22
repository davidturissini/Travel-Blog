var UserSlugField = Backbone.View.extend({
	render:function () {
		var view = this;
		this.el.addEventListener("keyup", function (e) {
			view.model.set({slug:e.currentTarget.value})
		})
	}
})