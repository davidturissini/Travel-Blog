var ModalDialog = Backbone.View.extend({
  el:document.createElement("div"),
  initialize: function () {
    var dialog = this
    this.view = null
    this.options.parentElem = this.options.parentElem || document.body
    this.viewFinder = document.createElement("section")
    this.viewFinder.className = "viewfinder"
    this.el.className = "modal-dialog"



    document.addEventListener("keyup", function (e) {
      if( !dialog.isVisible() ) { return }
      switch(e.keyCode) {
        case 27:
          dialog.close()
          break;
      }
    })
  },
  setView: function (elem) {
    this.view = elem
    this.viewFinder.innerHTML = ""
    this.viewFinder.appendChild( this.view )
  },
  close: function () {
    this.el.className = this.el.className.replace("visible", "")
    this.el.parentNode.removeChild( this.el )
    document.body.style.overflow = "auto"
  },
  append: function () {
    var dialog = this
    dialog.options.parentElem.appendChild( this.el )
  },
  show: function () {
    this.append()
    this.autocenter()
    document.body.style.overflow = "hidden"
    this.el.className += " visible"
  },
  __verticalCenter: function () {
    var height = this.viewFinder.offsetHeight,
    windowHeight = window.innerHeight,
    margin = (windowHeight - height) / 2
    this.viewFinder.style.height = height + "px"
    this.viewFinder.style.marginTop = margin + "px"
    this.viewFinder.style.marginBottom = margin + "px"
  },
  autocenter: function () {
    this.viewFinder.style.float = "left"
    var width = this.viewFinder.offsetWidth
    this.viewFinder.style.float = "none"
    this.viewFinder.style.width = width + "px"
    this.viewFinder.style.marginLeft = "auto"
    this.viewFinder.style.marginRight = "auto"
    this.__verticalCenter()
  },
  isVisible: function () {
    return this.el.className.indexOf("visible") != -1
  },
  render:function () {
    var dialog = this,
    close = document.createElement("a")
    close.className = "close"
    close.innerHTML = "x"
    close.addEventListener("click", function () {
      dialog.close()
    })

    this.el.innerHTML = "";

    [].forEach.call([close, dialog.viewFinder], function (elem) {
      dialog.el.appendChild(elem)
    })

    this.show()
  }
})