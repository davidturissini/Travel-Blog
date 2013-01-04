var Hero = Backbone.View.extend((function () {

	var processClassName = function (elem) {
		if(!/\sfocused/.test(elem.className)) {
			elem.className += " focused";
		}
	}

	var cleanClassName = function (elem) {
		elem.className = elem.className.replace(" focused", "");
	}

	var drawNav = function (hero) {
		
		var nav = document.createElement("nav"),
		navs = [];
		nav.className = "hero-nav";

		[].forEach.call(hero.options.elements, function (elem, index) {
			var link = document.createElement("a");
			link.addEventListener("click", function (e) {
				e.preventDefault();
				hero.showAtIndex(index);
				triggerInteracted(hero);
			})
			navs.push(link);
			nav.appendChild(link);

			hero.on("show", function (evt) {
				if(evt.in === elem) {
					link.className += " active";
				} else if (/\sactive/.test(link.className)) {
					link.className = link.className.replace(" active", "");
				}
			})
		})

		hero.el.appendChild(nav);
		return nav;
	}

	var triggerInteracted = function (hero) {
		hero.trigger("userinteracted", {hero:hero});
	}

	var rotate = function (hero, time) {

		var interval = setInterval(function () {
			hero.showNext();
		}, time);

		hero.on("userinteracted", function () {
			clearTimeout(interval);
		});

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

				this.trigger("show", {
					hero:this, 
					out:oldCurrent, 
					in:elem
				});

				return {
					out:oldCurrent,
					in:elem
				};
			}
		},

		render: function () {
			var hero = this;
			drawNav(hero);
			hero.showAtIndex(0);
			rotate(hero, 5000);

			hero.el.addEventListener("mouseover", function () {
				triggerInteracted(hero);
			})

			return hero;
		}
	}
})());