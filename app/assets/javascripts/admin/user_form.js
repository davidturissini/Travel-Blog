var UserForm = Backbone.View.extend({
	render: function () {
		var form = this,
		user = form.model

		new CityField({
			map:form.options.map,
			model:user,
			input: document.getElementById("user-city")
		}).render()

		new CountryField({
			map:form.options.map,
			model:user,
			input: document.getElementById("user-country_id"),
      		textElem: document.getElementById("user-country")
		}).render()

		form.el.addEventListener("submit", function (e) {
		    e.preventDefault()
		    user.isCurrentUser = true
		    user.jsonPrefix = true
		    user.save({slug: document.getElementById("user-slug").value}, {
			    success:function () {
			        window.location.reload()
			    }
		    })
		})

		return this
	}
})