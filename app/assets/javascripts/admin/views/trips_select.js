var TripsSelect = Backbone.View.extend((function () {

		function drawSelect(el, trips, selectedTrip, includeBlank) {

			if(includeBlank === true) {
				var option = document.createElement("option");
				option.innerHTML = "Select Trip";
				el.appendChild(option);
			}

			trips.each(function (trip) {
				var option = document.createElement("option"),
				tripId = trip.get("id")
				option.setAttribute("value", tripId);
				option.innerHTML = trip.get("title");
				if(selectedTrip === trip) {
					option.setAttribute("selected", "selected");
				}
				el.appendChild(option);
			})

		}

		function getSelectedTrip(needle, haystack) {
			if(needle instanceof Trip) {
				return trip;
			}

			return haystack.get(needle);
		}

		return {
			initialize:function () {
				this.options.includeBlank = this.options.includeBlank || true;
			},
			tagName:"select",
			render:function () {
				var view = this;
				view.el.className = "trips-select";
				view.options.user.fetchTrips({
					success:function (trips) {

						var selected = getSelectedTrip(view.options.selected, trips);

						drawSelect(view.el, trips, selected, view.options.includeBlank);
					}
				})
			}
		}
	})()
);