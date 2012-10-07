var AdminTemplate = Template.extend({
	load:function (callbacks) {
		var template = this;
		callbacks = callbacks || {};
		$.ajax({
			url:template.get("user").url({includeFormat:false}) + "/template/" + template.id,
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