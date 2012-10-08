var Tabs = Backbone.View.extend({
	__bindNavClicks:function () {
		var tabs = this,
		i = 0;
		for(i; i < tabs.options.tabLinks.length; i += 1) {
			var link = this.options.tabLinks[i];
			link.addEventListener("click", function (e) {
				e.preventDefault();
				var target = e.currentTarget.getAttribute("href").replace("#", "");
				tabs.showTab(target);
			})
		}
	},
	hideTabs:function () {
		var i = 0;
		for(i; i < this.options.tabViews.length; i += 1) {
			var tab = this.options.tabViews[i];
			if( tab.className.indexOf(" visible") !== -1 ) {
				tab.className = tab.className.replace(" visible", "");
			}
		}

		if( this.el.className.indexOf(" open") !== -1 ) {
			this.el.className = this.el.className.replace(" open", "");
		}
	},
	showTab:function (id) {
		this.hideTabs();
		document.getElementById(id).className += " visible";
		this.el.className += " open"
	},
	__bindCloseButton:function () {
		if( !this.options.closeButton ) { return }
		var tabs = this;
		this.options.closeButton.addEventListener("click", function () {
			tabs.hideTabs();
		})
	},
	render:function () {
		var tabs = this;

		tabs.__bindNavClicks();
		tabs.__bindCloseButton();


		return tabs;
	}
})