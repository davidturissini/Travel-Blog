LocationTypeTable = Backbone.View.extend({
    initialize: function () {
     var view = this
     this.collection.on("remove", function (model, collection, options) {
      model.setUser(view.options.user)
      model.destroy({
       success:function () {
        options.elem.parentNode.removeChild(options.elem)   
       }
      })
     })
    },
    render: function () {
     var list = this;
     [].forEach.call(this.el.getElementsByClassName("location-type"), function (elem, index) {
      var remove = elem.getElementsByClassName("remove").item(0)
      remove.addEventListener("click", function () {
        var id = JSON.parse( elem.getAttribute("data-json") ).id,
        model = list.collection.get(id)
        if( confirm("Are you sure you want to delete '" + model.get("title") + "'?")) {
          list.collection.remove(model, {elem:elem}) 
        }
      })
     })
    }
   })