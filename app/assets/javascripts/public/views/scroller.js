var Scroller = Backbone.View.extend({
	initialize: function () {
		var scroller = this
		scroller.leftPaddle = document.createElement("a")
		scroller.rightPaddle = document.createElement("a")
		scroller.overflowContainer = document.createElement("div")
		scroller.containerWidth = 0
		scroller.viewportWidth = 0
		scroller.index = 0
		scroller.numVisibleItems = 0
		scroller.paddleWidth = 50

		scroller.el.className += " scroller"
		this.options.container.className += " container"
		scroller.overflowContainer.className = "overflow-container"

		scroller.leftPaddle.className += "left paddle"
		scroller.rightPaddle.className += "right paddle"

	},
	prev: function () {
		var scroller = this,
		elemLeft = parseInt(scroller.options.container.style.left) || 0,
		left = elemLeft < 0 ? elemLeft * -1 : elemLeft,
		numItems = scroller.options.items.length,
		targetLimit = scroller.index - scroller.visibleItems,
		limit = targetLimit >= 0 ? targetLimit : 0
		for(var i = scroller.index; i > limit; i--) {
			var elem = scroller.options.items.item(i)
			left -= elem.offsetWidth  
		}
		scroller.index = i
		scroller.options.container.style.left = left * -1 + "px"
		scroller.determineVisibleItems()
	},
	next: function () {
		var scroller = this,
		elemLeft = parseInt(scroller.options.container.style.left) || 0,
		left = elemLeft < 0 ? elemLeft * -1 : elemLeft,
		numItems = scroller.options.items.length,
		targetLimit = scroller.index + scroller.numVisibleItems,
		limit = targetLimit <= numItems - scroller.numVisibleItems ? targetLimit :  numItems - scroller.numVisibleItems
		for(var i = scroller.index; i < limit; i++) {
			var elem = scroller.options.items.item(i)
			left += elem.offsetWidth 
		}
		scroller.index = i
		scroller.options.container.style.left = left * -1 + "px"
		scroller.determineVisibleItems()
	},
	determineVisibleItems: function () {
		var scroller = this,
		itemsWidth = 0

		scroller.numVisibleItems = 0 
		scroller.viewportWidth = scroller.el.offsetWidth - (scroller.paddleWidth * 2)
		for(var i = scroller.index; i < scroller.options.items.length; i++) {
			var elem = scroller.options.items.item(i)
			if( elem.offsetWidth + itemsWidth <= scroller.viewportWidth ) {
				itemsWidth += elem.offsetWidth
				scroller.numVisibleItems++
			} else {
				continue
			}
		}
		scroller.overflowContainer.style.width = itemsWidth + "px"
		var diff = scroller.el.offsetWidth - (itemsWidth + scroller.paddleWidth * 2)
		scroller.leftPaddle.style.marginLeft = diff / 2 + "px"
		scroller.rightPaddle.style.marginRight = diff / 2 + "px"
	},
	scrollInView:function (index) {
		var visibleItems = this.numVisibleItems,
		page = Math.floor(index / visibleItems);
		for(var i = 0; i < page; i += 1) {
			this.next();
		}

	},
	bindPaddles:function () {
		var scroller = this;
		scroller.leftPaddle.addEventListener("click", function () {
			scroller.prev()
		})

		scroller.rightPaddle.addEventListener("click", function () {
			scroller.next()
		})
	},
	render: function () {
		var scroller = this

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
			scroller.containerWidth += elem.offsetWidth
		})

		scroller.options.container.style.width = scroller.containerWidth + "px"
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