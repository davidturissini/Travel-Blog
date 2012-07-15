
   var LocationsCollection = Backbone.Collection.extend({
    model:Location,
    initialize:function () {
      this.selected = null
    },
    setSelected: function (location) {
      this.selected = location
      this.trigger("selectedChange", {location:location})
    }
   })
