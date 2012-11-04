var TripMap = GoogleMap.extend({
	showLocationString:function(string) {
		if( !this.options.geoElem ) { return }
		this.options.geoElem.innerHTML = string;
	},
    render:function () {
    	GoogleMap.prototype.render.call(this);
        this.setLocations(this.model.locations());
        this.setMaps(this.model.maps());
    	return this;
    }
})