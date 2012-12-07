var UserSlugField = Backbone.View.extend({
	render:function () {
		var view = this;
		this.el.addEventListener("keyup", function (e) {
			User.validateSlug(e.currentTarget.value, {
				success:function (resp) {
					view.model.set({slug:resp.slug})
				}
			})
		})
	}
})