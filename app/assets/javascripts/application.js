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
	if( !document.querySelector("#user-info .dropdown") ) { return }
	if( TA.currentUser && !TA.currentUser.isAnonymous() ) {
		new DropDown({
			el:document.querySelector("#user-info .dropdown"),
			control:document.querySelector("#user-info .control")
		}).render();
	}
	
	var gallery = new Gallery({
		el:document.getElementById("hero"),
		nodes:document.getElementById("hero").getElementsByClassName("slide")
	})
	
	gallery.render();
})