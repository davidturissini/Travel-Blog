var AutoSaveTextField = Backbone.View.extend({
	__bindKeyUp:function () {
		var view = this;
		var timeout = null;
        view.el.addEventListener("keyup", function (e) {
            view.model.set(view.options.property, e.currentTarget.value);
            if( timeout ) { clearTimeout(timeout); };
            timeout = setTimeout(function () {
                view.model.save({}, {
                	success:function () {
                		view.trigger("model_save", {model:view.model})
                	}
                });
            }, 500);
        });
	},
	render: function () {
		this.__bindKeyUp();
		return this;
	}  
});