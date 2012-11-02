var FileInput = Backbone.View.extend({
  initialize:function () {
    var uploader = this;
    this._allowedExtensions = [];
    this.files = [];
  },
  clear:function () {
    this.files.reset();
  },
  setAllowedExtensions:function (extensions) {
    this._allowedExtensions = extensions;
  },
  allowedExtensions:function () {
    return this._allowedExtensions;
  },
  validateFile:function (file) {
    var types = this.allowedExtensions();
    if( types.length === 0 ) { return true }

    var fileNameSplit = file.name.split("."),
    extension = fileNameSplit[fileNameSplit.length - 1];
    if( !extension ) { return false }


    for(var x in types) {
      var regexp = new RegExp(types[x]);
      if( regexp.test(extension) ) {
        return true;
      }
    }

    return false;
  },
  addFile:function (file) {
  	this.files.push(file);
    this.trigger("file_added", {file:file})
  },
  addFiles:function (files) {
  	for(var i = 0; i < files.length; i += 1) {
      if( this.validateFile(files[i]) ) {
  		  this.addFile(files[i]);
      }
  	}
  },
  __setupInput:function () {
    var uploader = this;

    uploader.options.input.addEventListener("change", function (e) {
      var files = e.currentTarget.files;
      uploader.addFiles(files);
    });
  },
  __setupDropTarget:function () {
    if( !this.options.dropTarget ) { return }

    (function (uploader) {
      uploader.el.addEventListener("dragenter", function (event) {
        uploader.el.className += " dragenter";
      });
      uploader.el.addEventListener("dragleave", function (event) {
        uploader.el.className = uploader.el.className.replace("dragenter", "");
      });
      uploader.options.dropTarget.addEventListener("drop", function (event) {
        event.stopPropagation();
        event.preventDefault();
        uploader.el.className = uploader.el.className.replace("dragenter", "");
        uploader.addFiles(event.dataTransfer.files);
      }, false);
    })(this);
  },
  __bindUploadButton:function () {
    var uploader = this;
    if( !this.options.uploadButton ) { return }
    this.options.uploadButton.addEventListener("click", function (e) {
      uploader.uploadFiles();
    })
  },
  __bindClearButton:function () {
    var uploader = this;
    if( !this.options.clearButton ) { return }
    this.options.clearButton.addEventListener("click", function (e) {
      uploader.clear();
    })
  },
  render:function () {
    this.__setupDropTarget();
    this.__setupInput();
    this.__bindUploadButton();
    this.__bindClearButton();
    return this;
  }
})