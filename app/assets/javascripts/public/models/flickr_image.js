var FlickrImage = Backbone.Model.extend({
 url: function (size) {
  size = size ? "_" + size : ""
  return "http://farm" + this.get("farm") + ".static.flickr.com/" + this.get("server") + "/" + this.get("id") + "_" + this.get("secret") + size + ".jpg"
 } 
})