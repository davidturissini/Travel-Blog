var InfiniteScroll = Backbone.View.extend({

		_page:1,
		_limit:18,

		_hitLimit:false,

		initialize: function () {
			this.url = this.el.getAttribute("data-infinite");
			this._page = this.options.page || 1;
			this._limit = this.options.limit || 18;
		},

		_isFetching: false,

		isFetching: function (value) {

			if(typeof value === "boolean") {
				this._isFetching = value;
			} else {
				return this._isFetching;
			}

		},

		fetch: function (options) {
			if(this._hitLimit || this.isFetching()) { return }

			this.isFetching(true);

			options = options || {};

			$.ajax({
				
				url:this.url,
				data:{
					page:this._page,
					limit:this._limit
				},

				success:function (e) {
					if(e === "") {
						this._hitLimit = true;
						return;
					}

					this._page += 1;

					var div = document.createElement("div");
					div.innerHTML = e;

					this.el.appendChild(div);
					
					setTimeout(function () {
						this.isFetching(false);
					}.bind(this), 500);

				}.bind(this)
			})

		},

		listenToScroll: function () {

			var scrollOptions = {
				target:this.el,
				scrollEnd:function (e) {
					if(!this.isFetching()) {
						this.fetch();
					}
				}.bind(this)
			};

			if (this.options.scrollEl) {
				scrollOptions.scrollEl = this.options.scrollEl;
			}

			new ScrollHandler(scrollOptions);

		},

		render: function () {

			this.listenToScroll();

			return this;
		}
});