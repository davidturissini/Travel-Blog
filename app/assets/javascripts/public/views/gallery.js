var Gallery = Backbone.View.extend({
	initialize: function () {
		var gallery = this;

		gallery.__keyup = function (e) {
			switch(e.which) {
				case 27:
					gallery.close()
					break;
				case 37:
					gallery.selectPrev()
					break;
				case 39:
					gallery.selectNext()
					break;
			}
		}

		this.options.selectedIndex = this.options.selectedIndex || 0;
	},
	setSelected:function (photoIndex) {
		if( photoIndex == this.options.selectedIndex ) { return }
		if(this.options.selectedIndex != null) {
			this.selectedNode().className = this.selectedNode().className.replace(" selected", "")
		}
		this.options.selectedIndex = photoIndex
		this.focusSelected()
	},
	selectNext: function () {
		var nodesLen = this.options.nodes.length,
		next = (this.options.selectedIndex) + 1;

		if( next < nodesLen ) {
			this.setSelected(next)
		}
	},
	selectPrev: function () {
		var prev = this.options.selectedIndex - 1
		if( prev >= 0 ) {
			this.setSelected(prev)
		}
	},
	selectedNode:function () {
		return this.options.nodes.item(this.options.selectedIndex);
	},
	selectedIndex:function () {
		return this.options.selectedIndex;
	},
	focusSelected: function () {
		var gallery = this,
		node = this.selectedNode();

		if( !/selected/.test(node.className) ) {
			node.className += " selected"
		}
		this.loading.loading();
		LazyImage.renderAll(node, {
			onload:function () {
				gallery.loading.doneLoading();
			}
		});

		this.trigger("select_change", {
			gallery:this, 
			selectedNode:node, 
			selectedIndex:this.options.selectedIndex
		});
		return this;
	},
	render:function () {
		var gallery = this;
		this.loading = new Loading();
		this.loading.render();

		if( !/gallery/.test(this.el.className) ) {
			this.el.className += " gallery"
		}

		this.focusSelected();

		[].forEach.call(this.options.nodes, function (node, index) {
			if( !/slide/.test(node.className) ) {
				node.className += " slide";
			}
		});

		document.addEventListener("keyup", gallery.__keyup);

		return gallery
	}
})