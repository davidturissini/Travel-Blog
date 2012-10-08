var PhotoEditView = Backbone.View.extend({
	disableSubmit:function () {
		this.save.setAttribute("disabled", "disabled");
	},
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
			loadingMessage = form.__buildLoadingView(),
			totalToProcess = form.collection.models.length + form.removedCollection.models.length
			loading.render();

			loadingMessage.message.innerHTML = "Saving 0 of " + totalToProcess + " photos";
			loading.setLoadingView(loadingMessage.div);
			
			loading.loading();

			function updateLoadingMessage() {
				numSaved += 1;
				loadingMessage.progress.setAttribute("value", numSaved);
				loadingMessage.message.innerHTML = "Saving " + numSaved + " of " + totalToProcess + " photos";
				if( numSaved === totalToProcess ) {
					loading.doneLoading();
				}
			}

			form.collection.each(function (photo) {
				photo.save({}, {
					success:function () {
						updateLoadingMessage();
					}
				})
			})

			form.removedCollection.each(function (photo) {
				photo.destroy({
					success:function () {
						updateLoadingMessage();
					}
				})
			})
		})
	},
	__bindPhotoRemoval:function () {
		var view = this;
		this.collection.on("remove", function (model) {
			view.removedCollection.add(model);
		});
	},
	render:function () {
		this.save = this.el.getElementsByClassName("save").item(0);
		this.removedCollection = new PhotosCollection();
		this.__bindSaveButton();
		this.__bindPhotoRemoval();
		return this;
	}
})