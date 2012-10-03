var Gallery = Backbone.View.extend({
	initialize: function () {
		var gallery = this

		gallery.__keyup = function (e) {
			switch(e.which) {
				case 27:
					gallery.close()
					break;
				case 37:
					gallery.focusPrev()
					break;
				case 39:
					gallery.focusNext()
					break;
			}
		}
	},
	__distanceToLeft: function () {
		var relative = this.el.offsetParent,
		offset = this.el.offsetLeft

		while(relative != document.body) {
			offset += relative.offsetLeft
			relative = relative.offsetParent
		}

		return offset
	},
	close: function () {
		var gallery = this
		this.el.className = this.el.className.replace(" gallery", "")
		this.el.style.left = "auto";
		this.el.style.marginLeft = "auto"
		this.el.style.marginRight = "auto";
		this.el.querySelector("ul").style.width = "auto";
		[].forEach.call(gallery.options.photos, function (photo, index) {
			photo.style.marginTop =  "0px"
			photo.className = photo.className.replace(" selected", "")
		})
		document.removeEventListener("keyup", gallery.__keyup)
		if( this.options.onClose ) {
			this.options.onClose()
		}
	},
	setSelected:function (photoIndex) {
		if( photoIndex == this.options.selectedIndex ) { return }
		if(this.options.selectedIndex != null) {
			this.selectedPhoto().className = this.selectedPhoto().className.replace(" selected", "")
		}
		this.options.selectedIndex = photoIndex
		this.focusSelected()
	},
	focusNext: function () {
		var photosLen = this.options.photos.length,
		next = this.options.selectedIndex + 1

		if( next < photosLen ) {
			this.setSelected(this.options.selectedIndex + 1)
		}
	},
	focusPrev: function () {
		var prev = this.options.selectedIndex - 1
		if( prev >= 0 ) {
			this.setSelected(prev)
		}
	},
	selectedPhoto:function () {
		return this.options.photos.item(this.options.selectedIndex)
	},
	calculateWidth:function () {
		var gallery = this,
		width = 0;
		[].forEach.call(gallery.el.querySelectorAll("li"), function (li) {
			var style = getComputedStyle(li)
			width += li.offsetWidth + parseInt( style.marginLeft ) + parseInt( style.marginRight )
		})

		return width
	},
	focusSelected: function () {
		var photo = this.selectedPhoto(),
		photoLen = this.options.photos.length,
		lastPhoto = this.options.photos.item(photoLen - 1),
		oldWidth = photo.offsetWidth,
		ul = this.el.querySelector("ul")


		if( !/selected/.test(photo.className) ) {
			photo.className += " selected"
		}
		ul.style.width = this.calculateWidth() + "px"

		ul.style.left = (-1 * (photo.offsetLeft - (this.el.offsetWidth / 2 - photo.offsetWidth / 2))) + "px"
		this.positionPhotos()
	},
	positionPhotos:function () {
		var gallery = this,
		ul = gallery.el.querySelector("ul"),
		selectedPhoto = this.selectedPhoto()
		selectedPhoto.style.marginTop = "0px"
		
		var computedULHeight = parseInt( getComputedStyle(ul).height )


		if( selectedPhoto.offsetHeight > computedULHeight ) {
			ul.style.height = selectedPhoto.offsetHeight + "px";
			computedULHeight = parseInt( getComputedStyle(ul).height )
		};

		[].forEach.call(gallery.options.photos, function (photo, index) {
			photo.style.marginTop = (computedULHeight / 2) - (photo.offsetHeight / 2) + "px"
		})

	},
	render:function () {
		var gallery = this,
		margin = this.__distanceToLeft()
		this.el.className += " gallery"

		this.el.style.marginLeft = -margin + "px"
		this.el.style.marginRight = -margin + "px"

		this.focusSelected();
		[].forEach.call(this.options.photos, function (photo, index) {
			photo.addEventListener("click", function () {
				gallery.setSelected(index)
			})
		})


		document.addEventListener("keyup", gallery.__keyup)

		return gallery
	}
})