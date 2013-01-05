
var ScrollHandler = function (options) {
	var scroll = this;
	scroll.target = options.target;

	function distanceToTop() {
		var relative = scroll.target.offsetParent,
		offset = scroll.target.offsetTop

		while(relative != document.body) {
			offset += relative.offsetTop;
			relative = relative.offsetParent;
		}

		return offset;
	}

	function pixelsVisible() {
		return (options.target.offsetHeight - pixelsBelowFold()) * 100
	}

	function pixelsBelowFold() {
		return distanceToTop() - windowVisibleY()[1];
	}

	function windowVisibleY() {
		var scrollTop = window.scrollY
		return [scrollTop, window.innerHeight + scrollTop]
	}

	function percentVisible() {
		return pixelsVisible() / options.target.offsetHeight
	}

	function elOffsetHeight() {
		return scroll.target.offsetHeight;
	}

	function calculateScroll() {
		var elemTop = distanceToTop(),
		visibleYRange = windowVisibleY()

		if( elemTop > visibleYRange[0] && elemTop < visibleYRange[1] && options.onScroll ) {
			
			options.onScroll({
				percentVisible:percentVisible(),
				pixelsVisible:pixelsVisible()
			});

		}

		if( elemTop + elOffsetHeight() < visibleYRange[1] + window.scrollY && options.scrollEnd) { 
			options.scrollEnd({
				percentVisible:percentVisible(),
				pixelsVisible:pixelsVisible()
			});
		}


	}

	window.addEventListener("scroll", function (e) {
		calculateScroll()

	})

	calculateScroll()
}