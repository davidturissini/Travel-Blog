var AdminTemplate = Template.extend({
	load:function (callbacks) {
		var template = this,
		data = this.get("params") || {}
		callbacks = callbacks || {};

		$.ajax({
			url:template.get("user").url({includeFormat:false}) + "/template/" + template.id,
			data:data,
			success:function (e) {
				var div = document.createElement("div");
				div.innerHTML = e;
				if( callbacks.success ) {
					callbacks.success(div);
				}
			}
		});
	}
});