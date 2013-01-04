var Hero = Backbone.View.extend((function () {

	var processClassName = function (elem) {
		if(!/\sfocused/.test(elem.className)) {
			elem.className += " focused";
		}
	}

	var cleanClassName = function (elem) {
		elem.className = elem.className.replace(" focused", "");
	}

	return {
		initialize:function () {
			this.current = null;
			this.options.elements = Array.prototype.slice.call(this.options.elements, 0);
		},

		showAtIndex: function (index) {
			return this.show(this.options.elements[index]);
		},

		removeAtIndex: function (index) {
			var elem = this.options.elements[index];
			this.remove(elem);
			return elem;
		},

		hideCurrent: function () {
			this.remove(this.current);
			this.current = null;
		},

		hide: function (elem) {
			if(elem) {
				cleanClassName(elem);
			}
		},

		showPrevious:function () {
			var current = this.current,
			currentIndex = _.indexOf(this.options.elements, current),
			nextIndex = currentIndex - 1 < 0 ? this.options.elements.length - 1: currentIndex - 1;
			this.showAtIndex(nextIndex);
		},

		showNext: function () {
			var current = this.current,
			currentIndex = _.indexOf(this.options.elements, current),
			nextIndex = currentIndex + 1 === this.options.elements.length ? 0 : currentIndex + 1;
			this.showAtIndex(nextIndex);
		},

		show: function (elem) {
			if( elem ) {

				if(this.current) {
					var oldCurrent = this.current;
					cleanClassName(oldCurrent);
				}

				this.current = elem;
				processClassName(elem);
				return {
					out:oldCurrent,
					in:elem
				};
			}
		},

		render: function () {
			this.showAtIndex(0);
			return this;
		}
	}
})());