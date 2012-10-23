var DynamicTextarea = Backbone.View.extend({
	__bindEvents:function () {
		var view = this;
		this.el.addEventListener("keyup", function (e) {
			view.resize();
		})
	},
	resize:function () {
		this.el.style.height = "auto";
		if( this.el.scrollHeight <= this.el.offsetHeight ) { return }
		this.el.style.height = this.el.scrollHeight + "px";
	},
	render:function () {
		if( !/autosize/.test(this.el.className) ) {
			this.el.className += " autosize";
		}
		this.resize();
		this.__bindEvents();
	}
})