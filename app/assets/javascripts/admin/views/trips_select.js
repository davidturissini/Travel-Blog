var TripsSelect = Backbone.View.extend((function () {

	function drawSelect(el, trips) {
			var select = document.createElement("select");
			select.className = "trips-select";
			trips.each(function (trip) {
				var option = document.createElement("option");
				option.setAttribute("value", trip.get("id"));
				options.innerHTML = trip.get("title");
				select.appendChild(option);
			})

			el.appendChild(select);

		}

		return {
			render:function () {
				var view = this;
				this.options.user.fetchTrips({
					success:function (trips) {
						drawSelect(view.el, trips);
					}
				})
			}
		}
	})()
);