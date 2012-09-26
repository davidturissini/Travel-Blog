var Template = Backbone.Model.extend({
	load:function (callbacks) {
		var template = this;
		$.ajax({
			url:"/template/" + template.id,
			success:function (e) {
				if( callbacks.success ) {
					callbacks.success(e);
				}
			}
		});
	}
})