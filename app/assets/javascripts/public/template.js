var Template = Backbone.Model.extend({
	load:function (callbacks) {
		var template = this,
		data = this.get("params") || {}
		$.ajax({
			url:"/template/" + template.id,
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
})