var DynamicTextarea = Backbone.View.extend({
	__bindEvents:function () {
		var view = this;
		this.el.addEventListener("keyup", function (e) {
			view.resize();
		})
	},
	resize:function () {
		if( this.el.offsetHeight >= this.el.scrollHeight ) {
			var style = getComputedStyle(this.el),
			vertPadding = parseInt(style.paddingTop) + parseInt(style.paddingBottom);

			this.el.style.height = this.el.offsetHeight - vertPadding - 10 + "px";
			this.resize();
		} else if ( this.el.offsetHeight < this.el.scrollHeight ) {
			this.el.style.height = this.el.scrollHeight - vertPadding - 10 + "px";
		}
	},
	render:function () {
		var view = this;
		if( !/autosize/.test(this.el.className) ) {
			this.el.className += " autosize";
		}
		this.el.addEventListener("keyup", function () {
			view.resize();
		});
		view.resize();

		this.__bindEvents();
	}
})