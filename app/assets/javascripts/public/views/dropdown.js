var DropDown = Backbone.View.extend({
  initialize:function () {

    function inDropDown(elem) {
      if(elem == document.body) {
        return false
      } else {
        return inDropDown(elem.parentNode)
      }
    }

    return function () {
      var view = this,
      dropdown = this.el
      view.toggle = function (event) { 
        var toggle = /toggle/.test( view.options.control.className )
        if( toggle ) {
          view.hide(event)
        } else {
          view.show(event)
        }
      }

      view.hide = function (event) {
        if( event && event.target && inDropDown(event.target) ) {
          return
        }
        view.el.style.display = "none"
        view.options.control.className = view.options.control.className.replace(" toggle", "")
        document.removeEventListener("keyup", view.toggle)
        document.removeEventListener("click", view.hide)
      }
    }
  }(),
  show: function (event) {
    var view = this
    view.el.style.display = "block"
    view.options.control.className += " toggle"
    view.options.control.addEventListener("click", view.hide)
    if( event && event.stopImmediatePropagation ) {
        event.stopImmediatePropagation()
      }
    document.addEventListener("click", view.hide)
    document.addEventListener("keyup", function (e) {
      if( e.keyCode == 27 ) {
        view.hide()
      }
    })
  },
  render: function () {
    var view = this;
    this.options.control.addEventListener("click", view.toggle);
    return view;
  }
})
