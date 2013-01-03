window.TA.Class = (function () {

	var proto = {
		extend:function (prototype) {

			var instance = function (options) {
				this.options = options;
			}

			instance.prototype = prototype;

			return function (options) {
				var obj = new instance(options);

				return obj;
			}
			
		}
	};

	return proto;

})();

var Kayak = window.TA.Class.extend((function () {

	var baseUrl = "http://www.kayak.com/s/search/air";

	return {
		populateFlightSearch:function () {

		}
	}
})());