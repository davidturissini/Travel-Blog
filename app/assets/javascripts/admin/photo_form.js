var PhotoForm = Backbone.View.extend({
	__bindRemoveButton:function () {
		var form = this,
		photo = this.model,
		button = this.el.getElementsByClassName("remove").item(0);
		button.addEventListener("click", function (e) {
			if( confirm("Delete photo?") ) {
				form.el.parentNode.removeChild(form.el);
				form.trigger("removed", {form:form});
			}
		})
	},
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
		this.__bindRemoveButton();
		return this;
	}
})