var ModalDialog = Backbone.View.extend({
  el:document.createElement("div"),
  initialize: function () {
    var dialog = this;
    this.view = null;
    this.options.parentElem = this.options.parentElem || document.body;
    this.viewFinder = document.createElement("section");
    this.viewFinder.className = "viewfinder";
    this.content = document.createElement("div");
    this.content.className = "modal-content";
    this.el.className = "modal-dialog";

    this.titleElem = document.createElement("h1");
    this.titleElem.className = "modal-title";

    document.addEventListener("keyup", function (e) {
      if( !dialog.isVisible() ) { return }
      switch(e.keyCode) {
        case 27:
          dialog.close()
          break;
      }
    })

  },
  loading:function (message) {
    var loading = new Loading({
      el:document.createElement("div")
    });

    loading.render()

    if( message ) {
      loading.setMessage(message);
    }
    
    this.setView(loading.el);
    loading.addLoadingClass();
    this.render();
    loading.loading();

  },
  setView: function (elem) {
    this.view = elem;
    this.content.innerHTML = "";
    this.content.appendChild( this.view );
  },
  close: function () {
    this.el.className = this.el.className.replace("visible", "");
    this.el.parentNode.removeChild( this.el );
    this.viewFinder.style.marginTop = "auto";
    this.viewFinder.style.marginBottom = "auto";
    this.viewFinder.style.width = "auto";
    document.body.style.overflow = "auto";
    this.title = null;
    if( this.options.onclose && typeof this.options.onclose === "function" ) {
      this.options.onclose();
    }
  },
  append: function () {
    var dialog = this;
    dialog.options.parentElem.appendChild( this.el );
  },
  show: function () {
    this.append();
    this.autocenter();
    this.el.className += " visible";
  },
  __verticalCenter: function () {
    var height = this.viewFinder.offsetHeight,
    windowHeight = window.innerHeight,
    margin = (windowHeight - height) / 2;
    this.viewFinder.style.marginTop = margin + "px";
    this.viewFinder.style.marginBottom = margin + "px";
  },
  autocenter: function () {
    this.viewFinder.style.float = "left";
    this.viewFinder.style.width = "auto";
    var style = getComputedStyle( this.viewFinder ),
    width = this.viewFinder.offsetWidth - parseInt(style.paddingLeft) - parseInt(style.paddingRight);
    this.viewFinder.style.float = "none";
    this.viewFinder.style.width = width + "px";
    this.viewFinder.style.marginLeft = "auto";
    this.viewFinder.style.marginRight = "auto";
    this.__verticalCenter();
  },
  isVisible: function () {
    return this.el.className.indexOf("visible") != -1;
  },
  setTitle: function (title) {
    var dialog = this;
    this.title = title;
    if( this.el.getElementsByClassName("modal-title").length === 0 ) {
      dialog.viewFinder.appendChild( this.titleElem );
    }
    this.titleElem.innerHTML = "";
    this.titleElem.appendChild( document.createTextNode(this.title) );
  },
  appendCloseButton:function () {
    var dialog = this;
    if( dialog.el.getElementsByClassName("remove").length > 0 ) { return }
    var close = document.createElement("command");
    close.className = "remove";
    close.addEventListener("click", function () {
      dialog.close();
    });
    dialog.viewFinder.appendChild(close);
  },
  render:function () {
    var dialog = this

    dialog.appendCloseButton();

    dialog.el.appendChild(dialog.viewFinder);
    dialog.viewFinder.appendChild(this.content);

    dialog.show();
  }
})