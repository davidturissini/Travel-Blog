var AutoSaveTextField = Backbone.View.extend({
    elIsInput:function () {
        return (this.el.tagName === "input" || this.el.tagName === "textarea");
    },
	__bindKeyUp:function () {
		var view = this,
        timeout = null;

        if(!this.elIsInput()) {
            view.el.contentEditable = true;
        }

        view.el.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
        })

        view.el.addEventListener("keyup", function (e) {
            var elem = e.currentTarget,
            propVal = view.elIsInput() ? e.currentTarget.value : elem.innerHTML;

            view.model.set(view.options.property, propVal);
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