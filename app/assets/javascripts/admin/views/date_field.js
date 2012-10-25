var DateField = Backbone.View.extend({
	initialize:function () {
		this._defaultDate = new Date().toUTCString();
	},
	kalendae:function () {
		return this._kalendae;
	},
	_kalendaeOptions: function () {
		return {
			mode:"range",
			format:"MMMM DD, YYYY",
			useYearNav:false,
			months:2
		};
	},
	__buildKalendae:function () {
		var view = this,
		input = this.el.getElementsByTagName("input")[0];
		this._kalendae = new Kalendae.Input(input, this._kalendaeOptions());
		this._bindKalendaeEvents();
		
	},
	_bindKalendaeEvents:function () {
		var view = this;
		this.kalendae().subscribe("show", function (e) {
			var close = view.kalendae().container.getElementsByClassName("k-btn-close").item(0);
			close.addEventListener("click", function () {
				view.kalendae().hide();
				view.trigger("kalendae_close")
			});
		});

		this.kalendae().subscribe("change", function (a) {
			view._updateModel(view._kalendae.getSelectedAsDates());
		});
	},
	_updateModel:function (dateArray) {
		var update = {
			start_date:moment(dateArray[0]).format("YYYY-MM-DD"),
			end_date:null
			}

		if(dateArray[1]) {
			update.end_date = moment(dateArray[1]).format("YYYY-MM-DD")
		}
		
		this.model.set(update);
		this.trigger("model_set");
	},
	updateLabel:function () {
		var startDate = this.model.get("start_date"),
		str = moment(startDate).format(this._kalendaeOptions().format);

		if( this.model.get("end_date") ) {
			var endDate = this.model.get("end_date");
			str += " - " + moment(endDate).format(this._kalendaeOptions().format)
		}
		this.el.getElementsByTagName("span")[0].innerHTML = str;
	},
	defaultDate:function () {
		return this._defaultDate;
	},
	setDefaultDate:function (date) {
		if( date instanceof Date ) {
			this._defaultDate = date.toUTCString();
		} else if( new Date(date) != "Invalid Date" ) {
			this._defaultDate = new Date(date).toUTCString();
		}
	},
	__bindElem:function () {
		var view = this;
		this.el.addEventListener("click", function () {
			view.kalendae().show();
			view.trigger("click");
		})
	},
	render:function () {
		var view = this;
		this.__buildKalendae();
		this.__bindElem();
		this.model.on("change", function (model, changed) {
			if(changed.changes.start_date || changed.changes.end_date) {
				view.updateLabel();
			}
		})
		return this;
	}
})