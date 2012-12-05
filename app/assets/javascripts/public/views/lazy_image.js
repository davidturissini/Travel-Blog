var LazyImage = Backbone.View.extend({
	setHeightAndWidth:function () {
		var image = this;
		[].forEach.call(["height", "width"], function (prop) {
			var value = image.el.getAttribute("data-" + prop);

			if(value) {
				image.el.setAttribute(prop, value);
			}

			image.el.removeAttribute("data-" + prop);

		})
		
		this.el.setAttribute("width", this.dataAttribute());
	},
	swapSource:function () {
		this.el.setAttribute("src", this.dataAttribute());
		this.el.removeAttribute("data-src");
	},
	dataAttribute:function () {
		return this.el.getAttribute("data-src");
	},
	render:function () {
		var image = this;
		this.el.onload = function () {
			image.trigger("load", {image:image, el:this.el});
		}
		this.setHeightAndWidth();
		this.swapSource();
		
		this.el.className = this.el.className.replace("lazy", "");
		return this;
	}
})

LazyImage.init = function (context) {
	var nodes = context.getElementsByClassName("lazy"),
	array = [];
	[].forEach.call(nodes, function (node) {
		var lazy = new LazyImage({
			el:node
		});
		array.push(lazy);
	})

	return array;
}

LazyImage.renderAll = function (context, options) {
	options = options || {};
	var lazy = LazyImage.init(context),
	numRendered = 0;

	[].forEach.call(lazy, function (image) {
		image.on("load", function (evt) {
			if(options.onImageLoad) {
				options.onImageLoad(evt);
			}
			numRendered += 1;
			if(numRendered === lazy.length && options.onload) {
				options.onload();
			}
		});

		image.render();
	})
}