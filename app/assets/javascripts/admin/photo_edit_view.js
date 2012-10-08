var PhotoEditView = Backbone.View.extend({
	__buildLoadingView:function () {
		var div = document.createElement("div"),
		message = document.createElement("h4"),
		progress = document.createElement("progress")

		progress.setAttribute("max", this.collection.models.length);
		progress.setAttribute("valie", 0);
		div.appendChild(message);
		div.appendChild(progress);

		return {
			div:div,
			message:message,
			progress:progress
		}
	},
	__bindSaveButton:function () {
		var form = this,
		numSaved = 0;
		this.save.addEventListener("click", function (e) {
			e.preventDefault();
			var loading = new Loading({
				el:form.el
			}),
			loadingMessage = form.__buildLoadingView();
			loading.render();

			loadingMessage.message.innerHTML = "Saving 0 of " + form.collection.models.length + " photos";
			loading.setLoadingView(loadingMessage.div);
			
			loading.loading();
			form.collection.each(function (photo) {
				photo.save({}, {
					success:function () {
						numSaved += 1;
						loadingMessage.progress.setAttribute("value", numSaved);
						loadingMessage.message.innerHTML = "Saving " + numSaved + " of " + form.collection.models.length + " photos";

						if( numSaved === form.collection.models.length ) {
							loading.doneLoading();
						}
					}
				})
			})
		})
	},
	render:function () {
		this.save = this.el.getElementsByClassName("save").item(0);
		this.__bindSaveButton();
	}
})