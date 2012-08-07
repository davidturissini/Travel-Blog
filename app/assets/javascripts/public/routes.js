var LocationRouter = Backbone.Router.extend({
     routes:{
      "vacation/:vacation/":"vacationShow",
      "climb/:climb/":"climbShow",
      "drive/:drive/":"driveShow",
      "vacation/":"vacationIndex",
      "climb/":"climbIndex",
      "drive/":"driveIndex",
      "":"root"
     },
     root:function () {
       window.locationView.hide()
       window.map.unfocus()
     },
     vacationIndex: function () {
       this.index("vacation")
     },
     climbIndex: function () {
       this.index("climb")
     },
     driveIndex: function () {
       this.index("drive")
     },
     index: function(locType) {
       window.menu.expandLocationType(locType) 
       window.map.unfocus()
     },
     vacationShow:function(e) { 
      var location = window.menu.locations.vacations.where({post_name:e,post_type:"vacation"})[0]
      map.focusLocation( location )
     },
     driveShow:function(e) { 
      var drive = window.menu.locations.drives.where({post_name:e,post_type:"drive"})[0]
      map.focusLocation(drive)
     },
     climbShow:function (e) {
      var climb = window.menu.locations.climbs.where({post_name:e,post_type:"climb"})[0]
      map.focusLocation(climb)
     },
     navigateToLocationIndex: function (locType) {
       this.navigate("/" + locType + "/", {trigger:true})
     },
     navigateToLocation: function(loc) {
      if( loc ) {
       this.navigate("/" + loc.get("post_type") + "/" + loc.get("post_name") + "/", {trigger:true})
      } else {
       this.navigate("/", {trigger:true})
      }
     }
    })
