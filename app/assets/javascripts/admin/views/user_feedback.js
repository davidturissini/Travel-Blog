var UserFeedback = Backbone.View.extend({
	showError:function (message) {
		var p = document.createElement("p");
		p.innerHTML = message;
		p.className = "error";
		this.el.appendChild(p);
		return p;
	},
	showSuccess:function (message) {
		var p = document.createElement("p");
		p.innerHTML = message;
		p.className = "success";
		this.el.appendChild(p);
		return p;
	},
	render:function () {
		return this;
	}
})