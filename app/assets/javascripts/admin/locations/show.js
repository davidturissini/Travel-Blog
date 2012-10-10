window.addEventListener("DOMContentLoaded", function () {
	if( !/admin\-locations\-show/.test(document.body.className) ) { return }
    var location = Location.createFromDataAttribute( document.getElementById("location") ),
    locationMap = new LocationMap({
    	el:document.getElementById("location"),
    	model:location,
    	mapElem:document.getElementById("map"),
    	countryCollection:TA.countries
    });
        

    location.setUser(TA.currentUser);
    locationMap.render();

    location.loadCountry({
        success:function () {
            var editElem = document.getElementById("edit-location");
            editElem.addEventListener("click", function (e) {
                e.preventDefault();
                locationMap.setModel( location );
                locationMap.options.onsave = function () {
                    location.save({});
                }
                
            });

            var removeElem = document.getElementById("delete-location");
            removeElem.addEventListener("click", function (e) {
                e.stopPropagation();
                if( confirm("Delete " + location.geoString() + "?"))
                location.destroy({
                    success:function () {
                        elem.parentNode.removeChild(elem);
                    }
                })
            })
        }
    });
})