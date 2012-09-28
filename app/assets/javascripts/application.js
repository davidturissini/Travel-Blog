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
//= require 'public/template'
//= require 'public/models'
//= require 'public/collections'
//= require 'public/views'
//= require 'public/modal_dialog'
//= require_tree ./public/views/


window.addEventListener("DOMContentLoaded", function () {
	new DropDown({
		el:document.querySelector("#user-info .dropdown"),
		control:document.querySelector("#user-info .control")
	}).render()
})