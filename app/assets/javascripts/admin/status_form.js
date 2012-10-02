var StatusForm = Backbone.View.extend({
	addNewLocationOption:function (location) {
		var option = document.createElement("option");
		option.setAttribute("value", JSON.stringify(location.attributes));
		option.innerHTML = location.geoString();
		option.setAttribute("selected", "selected");
		this.el.querySelector("select").appendChild(option);
	},
	__bindElementChanges:function () {
		var form = this,
		textField = form.el.querySelector(".text"),
		locationField = form.el.querySelector(".locations");

		textField.addEventListener("keyup", function (e) {
			form.model.set({text:e.currentTarget.value});
		})

		locationField.addEventListener("change", function (e) {
			if( e.currentTarget.value !== "__NEW__" && e.currentTarget.value ) {
				var location = new Location( JSON.parse(e.currentTarget.value) );
				form.model.setLocation( location );
			} else if ( e.currentTarget.value === "__NEW__" ) {
				form.options.locationMap.model.on("change", function (model) {
					form.addNewLocationOption(model)
					form.model.setLocation(model);
				})
				form.options.locationMap.render();
			} else {
				form.model.clearLocation();
			}
		})
	},
	saveModel:function () {
		var form = this;
		form.model.save({}, {
			success:function () {
				console.log("status saved");
			}
		})
	},
	render:function () {
		var form = this;

		form.__bindElementChanges();

		this.el.querySelector(".save").addEventListener("click", function (e) {
			e.preventDefault();
			if( form.model.location && form.model.location.isNew() ) {
				form.model.location.save({}, {
					success:function (location) {
					form.model.setLocation(location)
					form.saveModel();
					}
				})
			} else if ( form.model.location && !form.model.location.isNew() ) {
				form.saveModel();
			} else if ( !form.model.location ) {
				alert("nope")
			}
		})

		return form;
	}
})