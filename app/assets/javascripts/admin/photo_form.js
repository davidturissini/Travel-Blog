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
		input = this.el.getElementsByClassName("photo-title").item(0)
		
		new AutoSaveTextField({
			model:photo,
			el:input,
			property:"title"
		}).render();

		new DynamicTextarea({
            el:input
        }).render();
	},
	__bindDescriptionInput:function () {
		var photo = this.model,
		input = this.el.getElementsByClassName("photo-description").item(0);

		new AutoSaveTextField({
			model:photo,
			el:input,
			property:"description"
		}).render();

		new DynamicTextarea({
            el:input
        }).render();
	},
	render:function () {
		this.__bindTitleInput();
		this.__bindDescriptionInput();
		this.__bindRemoveButton();
		return this;
	}
})