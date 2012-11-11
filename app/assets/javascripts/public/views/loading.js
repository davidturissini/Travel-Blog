var Loading = Backbone.View.extend({
	doneLoading:function () {
		this.el.className = this.el.className.replace(" loading", "");
		if( this.loadingUI.parentNode ) {
			this.loadingUI.parentNode.removeChild(this.loadingUI);
		}
	},
	setLoadingView:function (html) {
		this.loadingUI.innerHTML = "";
		this.loadingUI.appendChild(html);
	},
	setMessage:function (text) {
		var div = document.createElement("div");
		div.innerHTML = text;
		this.setLoadingView(div);
	},
	addLoadingClass:function () {
		this.el.className += " loading";
	},
	loading:function () {
		this.addLoadingClass();
		if( this.loadingUI.parentNode !== this.el ) {
			this.el.appendChild(this.loadingUI);
		}
		this.center();
	},
	center:function () {
		if( this.options.center === false || this.loadingUI.children.length === 0 ) { return }
		var height = this.loadingUI.offsetHeight,
		viewHeight = this.loadingUI.children[0].offsetHeight;
		this.loadingUI.style.paddingTop = parseInt(height / 2) - parseInt(viewHeight / 2) + "px";

	},
	createLoadingUI:function () {
		this.loadingUI = document.createElement("div");
		this.loadingUI.className = "loading-ui";
	},
	render:function () {
		this.createLoadingUI();
		return this;
	}
})