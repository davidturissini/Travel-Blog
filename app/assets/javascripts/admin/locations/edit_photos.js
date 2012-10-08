window.addEventListener("DOMContentLoaded", function () {
  if( !/admin\-locations\-edit_photos/.test(document.body.className) ) { return }

  var loc = Location.createFromDataAttribute( document.getElementById("location") ),
  locationPhotosJSON = JSON.parse( document.getElementById("location-photos").getAttribute("data-json") ),
  locationPhotos = new PhotosCollection(locationPhotosJSON);

  loc.setUser(TA.currentUser);
  var photoUploader = new PhotoUploader({
      model:loc,
      el:document.getElementById("photo-upload"),
      input:document.querySelector("#photo-upload input"),
      previewElem:document.getElementById("photo-container"),
      dropTarget:document.getElementById("photo-container")
    });

    photoUploader.on("photos_uploaded", function (e) {
      window.location.reload();
    })

    photoUploader.render();

    document.getElementById("save-photos").addEventListener("click", function () {
      photoUploader.uploadFiles();
    })

    var flickrController = document.getElementById("user-flickr-controller"),
    flickrRealm = JSON.parse( flickrController.getAttribute("data-realm") );

    if( flickrController ) {
      new Tabs({
        el:flickrController,
        tabLinks:flickrController.getElementsByClassName("flickr-tab-link"),
        tabViews:flickrController.getElementsByClassName("flickr-tab")
      }).render();

      var flickrPhotoSetLinks = flickrController.getElementsByClassName("flickr-set");

      for(var i = 0; i < flickrPhotoSetLinks.length; i += 1) {
        var link = flickrPhotoSetLinks[i];
        link.addEventListener("click", function (evt) {
          var data = JSON.parse( evt.currentTarget.getAttribute("data-set") )
          TA.currentUser.flickrset_photos(data.id, {
            success:function (e) {
              var photos = e.photo;
              for(var i = 0; i < photos.length; i += 1) {
                (function (photo) {
                  var image = new Image();
                  image.onload = function (e) {
                    photoUploader.addImage(image);
                  }

                  image.src = photo.url();
                })( new FlickrImage(photos[i]) );
              }
            }
          });
        })
      }

    }
  locationPhotos.each(function (photo) {
    photo.setLocation(loc);
    var form = new PhotoForm({
      model:photo,
      el:document.getElementById("photo-" + photo.id)
    }).render();
  })

  var edit = new PhotoEditView({
    el:document.getElementById("location-photos"),
    collection:locationPhotos
  }).render();

})