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
			var body = jQuery( tinyMCE.getInstanceById(view.options.bodyField.id).getContent() ),
			youTubeVideos = jQuery('.mceItem', body), container = document.createElement('div');

			youTubeVideos.each(function (index, imgTag) {
				var iframe = document.createElement('iframe');
				iframe.setAttribute('src', 'http://www.youtube.com/embed/' + imgTag.getAttribute('alt'));
				iframe.setAttribute('width', '560');
				iframe.setAttribute('height', '315');
				jQuery(imgTag).replaceWith(iframe);
			})
			
			body.appendTo(container);

			view.model.set({body:jQuery(container).html()});
			view.trigger("post_save");
		})
	},
	__tinyMCE:function () {
		tinyMCE.init({
	        mode:"textareas",
	        theme: "advanced",
	        plugins: "youtube",
	        theme_advanced_buttons1 : "bold,italic,underline,|,link,unlink,|,bullist,blockquote,undo,|,youtube"
		});
	},	
	render:function () {
		this.__renderTitleField();
		this.__bindSaveButton();
		this.__tinyMCE();
		return this;
	}
})