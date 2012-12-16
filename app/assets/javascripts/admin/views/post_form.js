var PostForm = Backbone.View.extend({
	__renderTitleField:function () {
		var view = this;
		this.options.titleField.addEventListener("keyup", function (e) {
			view.model.set({title:e.currentTarget.value});
		})
	},
	__bindSaveButton:function () {
		var view = this;
		this.options.saveButton.addEventListener("click", function (e) {
			e.preventDefault();
			var body = tinyMCE.getInstanceById(view.options.bodyField.id).getContent();
			view.model.set({body:body});
			view.trigger("post_save");
		})
	},
	__tinyMCE:function () {
		tinyMCE.init({
	        mode:"textareas",
	        theme: "advanced",
	        theme_advanced_buttons1 : "bold,italic,underline,|,link,unlink,|,bullist,blockquote,undo"
		});
	},	
	render:function () {
		this.__renderTitleField();
		this.__bindSaveButton();
		this.__tinyMCE();
		return this;
	}
})