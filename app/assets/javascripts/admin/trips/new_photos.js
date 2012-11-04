window.addEventListener("DOMContentLoaded", function () {
  if( !/admin\-trips\-new_photos/.test(document.body.className) ) { return }

  /*

    INITIALIZE LOCATION

  */
  var trip = Trip.createFromDataAttribute( document.getElementById("trip") );
  trip.setUser(TA.currentUser);

  /*

    INITIALIZE PHOTO UPLOADER

  */
  var photoUploader = new PhotoUploader({
      model:trip,
      el:document.getElementById("photo-upload"),
      input:document.querySelector("#photo-upload input"),
      previewElem:document.getElementById("photo-container"),
      dropTarget:document,
      uploadButton:document.getElementById("save-photos"),
      clearButton:document.getElementById("clear-photos")
    });

    photoUploader.on("photos_uploaded", function (e) {
      window.location.href = trip.editPhotosUrl();
    });

    photoUploader.render();


  /* 

    INITIALIZE FLICKR IMPORTS 

  */

  var flickrSetsLink = document.getElementById("photo-upload-flickr"),
  flickrDialog = new FlickrDialog();
  flickrDialog.setTitle("Import photos from Flickr");

  flickrDialog.on("photoset_click", function (event) {
        TA.currentUser.flickrset_photos(event.photoset.id, {
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
    
  flickrSetsLink.addEventListener("click", function (evt) {
    if( /auth\/flickr/.test( flickrSetsLink.getAttribute("href") ) ) { return }
      evt.preventDefault();
      var loading = new Loading({
        el:document.body
      }),
      loadingView = document.createElement("span");
      loadingView.innerHTML = "Loading flickr photos";

      loading.render();
      loading.setLoadingView(loadingView);
      loading.loading();

      flickrDialog.on("load", function () {
        loading.doneLoading();
      })
      flickrDialog.render();
  });

  if( /\?flickr/.test(window.location.href) ) {
    flickrDialog.render();
  }

 })