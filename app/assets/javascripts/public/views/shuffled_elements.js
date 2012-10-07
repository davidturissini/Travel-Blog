var ShuffledElements = Backbone.View.extend({
	__numElementsLoaded: 0,
	numElements:function () {
		return this.options.elements.length
	},
	positionHero:function (callback) {
		var shuffle = this,
		element = this.options.hero,
		image = element.querySelector("img")
		element.className += " shuffled"

		function position() {
			if( element.offsetHeight > shuffle.el.offsetHeight ) {
				shuffle.el.style.height = (element.offsetHeight) + "px"
			}
			
			var left = (shuffle.el.offsetWidth / 2) - (element.offsetWidth / 2),
			top = (shuffle.el.offsetHeight / 2) - (element.offsetHeight / 2)
			element.style.left = left + "px"
			element.style.top = top + "px"

			shuffle.positionDone();
			callback.success()
		}

		if(image.width != 0) {
			position()
		} else {
			image.onload = function () {
				position()
			}
		}

		shuffle.__bindHeroClick();
		
	},
	__bindHeroClick: function () {
		var shuffle = this
		if( this.options.heroClick ) {
			shuffle.options.hero.addEventListener("click", function (e) {
				shuffle.options.heroClick(e, {element:shuffle.options.hero})		
			})
		}
	},
	__bindElementClick: function (photo, index) {
		var shuffle = this
		if( this.options.elementClick ) {
			photo.addEventListener("click", function (e) {
				shuffle.options.elementClick(e, {element:photo, index:index})		
			})
		}
	},
	__getHeroBounds:function () {
		return {
			top:this.options.hero.offsetTop,
			left:this.options.hero.offsetLeft,
			right:this.options.hero.offsetLeft + this.options.hero.offsetWidth,
			bottom:this.options.hero.offsetTop + this.options.hero.offsetHeight,
			center:(this.options.hero.offsetLeft + (this.options.hero.offsetLeft + this.options.hero.offsetWidth)) / 2,
			verticalCenter:(this.options.hero.offsetTop + (this.options.hero.offsetTop + this.options.hero.offsetHeight)) / 2
		}
	},
	positionDone:function () {
		this.__numElementsLoaded += 1
		if( this.__numElementsLoaded == this.numElements() ) {
			this.el.style.opacity = 1;
		}
	},
	positionElement:function (photo, index) {
		if( photo == this.options.hero ) {
			return
		}

		var shuffle = this,
		photosContainer = this.el,
		bounds = shuffle.__getHeroBounds(),
		leftMultiplier = Math.cos(index),
		horizontalBounds = ((window.innerWidth - 200) / 2),
		top = (Math.random() * (photosContainer.offsetHeight - photo.offsetHeight)),
		left = bounds.center + (Math.cos(index) * 300) - (photo.offsetWidth / 2),
		rotate = Math.sin(index) * 10

		if( Math.cos(index) <= 0 ) {
			left -= 100
		} else {
			left += 100
		}
	
		photo.style.left = left + "px";
		photo.style.top = top + "px";
		photo.style.webkitTransform = "rotate(" + rotate + "deg)"
		photo.style.MozTransform = "rotate(" + rotate + "deg)"
		
		shuffle.positionDone();
		
	},
	render:function () {
		var shuffle = this;
		this.el.className += " shuffled-elements"
		shuffle.positionHero({
			success:function () {
				[].forEach.call(shuffle.options.elements, function (element, index) {
					element.className += " shuffled"
					function doPosition() {
						shuffle.__bindElementClick(element, index)
						shuffle.positionElement(element, index)
					}

					if( shuffle.options.elementShouldPosition ) {
						shuffle.options.elementShouldPosition({
							element:element,
							index:index,
							callback:doPosition
						})
					} else {
						doPosition()
					}
				})
			}
		});
		return shuffle
	}
})