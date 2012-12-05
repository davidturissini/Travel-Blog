// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require 'public/md5'
//= require 'public/user_photos'
//= require 'public/underscore'
//= require 'public/backbone'
//= require './public/kalendae.min.js'
//= require 'public/template'
//= require_tree ./public/models/
//= require_tree './public/collections'
//= require_tree ./public/views/
//= require 'public/views'
//= require_tree ./public/controllers/

window.TA.countries = new CountryCollection();

window.addEventListener("DOMContentLoaded", function () {

	(function () {
		var navElem = document.getElementById("trips-nav"),
		gallery = new Gallery({
			el:document.getElementById("hero"),
			nodes:document.getElementById("hero").getElementsByClassName("slide")
		}),
		nav = new GalleryNav({
			el:navElem,
			triggers:navElem.getElementsByClassName("trip-link"),
			gallery:gallery,
			listenForEvent:"mouseover"
		}),
		slider = new Scroller({
			el:navElem,
			container:navElem.getElementsByTagName("ul")[0],
			items:navElem.getElementsByTagName("li")
		});
		slider.render();

		if(navElem.getAttribute("data-current")) {
			var current = navElem.getAttribute("data-current");
			gallery.setSelected(current);
			slider.scrollInView(current);

			nav.el.addEventListener("mouseout", (function () {

				var galleryIndex = gallery.selectedIndex();

				return function (e) {
					if(e.currentTarget === nav.el) {
						gallery.setSelected(galleryIndex);
					}
				}

			})());
		}
		
		gallery.render();
		nav.render();
		
	})();
	
	

	

})