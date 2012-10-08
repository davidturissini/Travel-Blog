var PhotoForm = Backbone.View.extend({
	__bindTitleInput:function () {
		var photo = this.model,
		input = this.el.getElementsByClassName("title").item(0)
		input.addEventListener("keyup", function (e) {
			photo.set({title:e.currentTarget.value})
		})
	},
	__bindDescriptionInput:function () {
		var photo = this.model,
		input = this.el.getElementsByClassName("description").item(0)
		input.addEventListener("keyup", function (e) {
			photo.set({description:e.currentTarget.value})
		})
	},
	render:function () {
		this.__bindTitleInput();
		this.__bindDescriptionInput();
		return this;
	}
})