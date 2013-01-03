window.TA.Class = (function () {

	var proto = {
		extend:function (prototype) {

			var ta_class = function (options) {
				this.options = options;
			}

			ta_class.prototype = prototype;

			return function (options) {
				var c = new ta_class(options);
				if(c.initialize) {
					c.initialize(options);
				}

				return c;
			}
			
		}
	};

	return proto;

})();