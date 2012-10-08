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



    var flickrController = document.getElementById("user-flickr-controller"),
    flickrRealm = JSON.parse( flickrController.getAttribute("data-realm") );

    if( flickrController ) {

      var flickrPhotoSetLinks = flickrController.getElementsByClassName("flickr-set"),
      flickrDialog = new ModalDialog();

      for(var i = 0; i < flickrPhotoSetLinks.length; i += 1) {
        var link = flickrPhotoSetLinks[i];
        link.addEventListener("click", function (evt) {
          flickrDialog.close();

          var data = JSON.parse( evt.currentTarget.getAttribute("data-set") )
          TA.currentUser.flickrset_photos(data.id, {
            success:function (evt) {
              var photos = evt.photo;
              for(var i = 0; i < photos.length; i += 1) {
                (function (flickrPhoto, event) {
                  var image = new Image();
                  image.onload = function (e) {
                    var photo = new Photo();

                    if( flickrPhoto.get("title") ) {
                      photo.set({title:flickrPhoto.get("title")})
                    }

                    if( flickrPhoto.get("description") ) {
                      photo.set({title:flickrPhoto.get("description")})
                    }
                    photo.setRaw(image);
                    photoUploader.addPhoto(photo);
                  }

                  image.src = flickrPhoto.url();
                })( new FlickrImage(photos[i]), evt );
              }
            }
          });
        })
      }

      var flickrSetsLink = flickrController.getElementsByClassName("flickr-tab-link")[0],
      dialogHTML = document.getElementById("user-flickr-sets");
      
      flickrDialog.setView( dialogHTML );
      flickrDialog.setTitle("Import photos from flickr");

      flickrSetsLink.addEventListener("click", function (evt) {
        evt.preventDefault();
        flickrDialog.render();
      });

    }
  locationPhotos.each(function (photo) {
    photo.setLocation(loc);
    var form = new PhotoForm({
      model:photo,
      el:document.getElementById("photo-" + photo.id)
    }).render();
    form.on("removed", function (e) {
      locationPhotos.remove(e.form.model);
    });
  });

  var edit = new PhotoEditView({
    el:document.getElementById("location-photos"),
    collection:locationPhotos
  }).render();

  document.getElementById("save-photos").addEventListener("click", function (e) {
    e.currentTarget.setAttribute("disabled", "disabled");
    edit.disableSubmit();
    photoUploader.uploadFiles();
  })

})