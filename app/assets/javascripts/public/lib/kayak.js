var Kayak = window.TA.Class.extend((function () {

	var baseOptions = {
		ai:"kayaksample",
		doubleEncoded:"on",
		size:"300x250"
	},
	baseUrl = "http://www.kayak.com/widget/300x250";

	function setiFrameSource(iframe, options) {
		options = TA.Object.extend(baseOptions, options);
		iframe.setAttribute("src", baseUrl + "?" + TA.Object.serialize(options));
	}

	return {
		initialize:function (options) {
			this.options.defaults = options.defaults || {};
		},
		populate:function (options) {
			setiFrameSource(this.options.iframe, TA.Object.extend(this.options.defaults, options));
		}
	}
})());