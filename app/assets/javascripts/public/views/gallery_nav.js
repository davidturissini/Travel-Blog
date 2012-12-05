var GalleryNav = Backbone.View.extend({
	bindGalleryChange:function () {
		var nav = this;
		this.options.gallery.on("select_change", function (evt) {
			nav.setSelected(evt.selectedIndex);
		})
	},
	setSelected:function (index) {
		this.eachTrigger(function (trigger) {
			if(/\sselected/.test(trigger.className)) {
				trigger.className = trigger.className.replace(" selected", "");
			}
		});

		var trigger = this.options.triggers.item(index);
		trigger.className += " selected";
	},
	eachTrigger:function (func) {
		[].forEach.call(this.options.triggers, func);
	},
	render: function () {
		var nav = this;

		this.bindGalleryChange();

		this.eachTrigger(function (trigger, index) {
			trigger.addEventListener("click", function (e) {
				e.preventDefault();
				nav.options.gallery.setSelected(index);
			});
		});

		if(this.options.gallery.selectedNode()) {
			this.setSelected(this.options.gallery.selectedIndex());
		}
	}
})