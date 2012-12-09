var Trip = Trip.extend({
	saveWithLocations:function (callbacks) {
		callbacks = callbacks || {};
		this.set({locations:this._locations.models});
		if( !this.isValid() ) { return }
			
		this.save({}, {
			success:function(e){
				if(callbacks.success) {
					callbacks.success(e);
				}
			}
		})
	},
	distributeUrl:function () {
		return this.url() + "/distribute";
	},
	distribute:function (callbacks) {
		window.location.href = this.distributeUrl();
	}
})