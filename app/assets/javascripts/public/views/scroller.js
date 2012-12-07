var Scroller = Backbone.View.extend({
	initialize: function () {
		var scroller = this
		scroller.leftPaddle = document.createElement("a")
		scroller.rightPaddle = document.createElement("a")
		scroller.overflowContainer = document.createElement("div")
		scroller.index = 0
		scroller.numVisibleItems = 0
		scroller.paddleWidth = 50

		scroller.el.className += " scroller"
		this.options.container.className += " container"
		scroller.overflowContainer.className = "overflow-container"

		scroller.leftPaddle.className += "left paddle"
		scroller.rightPaddle.className += "right paddle"

	},
	viewportWidth:function () {
		return this.el.offsetWidth - (this.paddleWidth * 2);
	},
	determineVisibleItems: function () {
		var scroller = this,
		itemsWidth = 0

		scroller.numVisibleItems = 0 
		for(var i = scroller.index; i < scroller.options.items.length; i++) {
			var elem = scroller.options.items.item(i);
			if( elem.offsetWidth + itemsWidth <= scroller.viewportWidth() ) {
				itemsWidth += elem.offsetWidth
				scroller.numVisibleItems++
			} else {
				continue
			}
		}
		scroller.overflowContainer.style.width = itemsWidth + "px"
		var diff = scroller.width() - (itemsWidth + scroller.paddleWidth * 2)
		scroller.leftPaddle.style.marginLeft = diff / 2 + "px"
		scroller.rightPaddle.style.marginRight = diff / 2 + "px"
	},
	leftPos:function () {
		return parseInt(this.options.container.style.left) || 0;
	},
	rightPos:function () {
		return -this.leftPos() + this.viewWidth();
	},
	containerWidth:function () {
		return this.options.container.offsetWidth;
	},
	indexVisible:function (index) {
		var elemLeft = this.options.items.item(index).offsetLeft,
		adjustedLeft = elemLeft + this.leftPos();
		return adjustedLeft >= 0 && adjustedLeft < this.viewWidth();
	},
	width:function () {
		return this.el.offsetWidth;
	},
	viewWidth:function () {
		return this.overflowContainer.offsetWidth;
	},
	scrollTo:function (pos) {
		if(pos > this.containerWidth() - this.viewWidth()) {
			pos = this.containerWidth() - this.viewWidth();
		} else if(pos < 0) {
			pos = 0;
		}

		this.options.container.style.left = -pos + "px";
	},
	scrollToIndex:function (index) {
		var scroller = this,
		elemLeft = this.leftPos();

		this.scrollTo(this.options.items.item(index).offsetLeft);
	},
	nextPage:function () {
		this.scrollTo(-this.leftPos() + this.viewWidth());
	},
	prevPage:function () {
		this.scrollTo(-this.leftPos() - this.viewWidth());
	},
	bindPaddles:function () {
		var scroller = this;
		scroller.leftPaddle.addEventListener("click", function () {
			scroller.prevPage()
		})

		scroller.rightPaddle.addEventListener("click", function () {
			scroller.nextPage()
		})
	},
	render: function () {
		var scroller = this,
		w = 0;

		scroller.el.innerHTML = ""
		scroller.overflowContainer.appendChild(scroller.options.container)

		var toAppend = []
		if( scroller.options.paddles !== false ) {
			toAppend = toAppend.concat([scroller.leftPaddle, scroller.rightPaddle])
		}
		toAppend.push(scroller.overflowContainer)
		toAppend.forEach(function (elem) {
			scroller.el.appendChild(elem)
		});

		[].forEach.call(scroller.options.items, function (elem) {
			w += elem.offsetWidth
		})

		scroller.options.container.style.width = w + "px"
		scroller.determineVisibleItems()  

		scroller.bindPaddles();

		if( scroller.options.dynamicResize === true ) {
			var resizeTimeout;
			window.addEventListener("resize", function () {
				clearTimeout(resizeTimeout)
				resizetimeout = setTimeout(function () {
					scroller.determineVisibleItems()
				}, 100);
			})
		}
		scroller.el.className = scroller.el.className + " ready";
		return scroller
	}
})