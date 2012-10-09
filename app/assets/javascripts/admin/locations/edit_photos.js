window.addEventListener("DOMContentLoaded", function () {
  if( !/admin\-locations\-edit_photos/.test(document.body.className) ) { return }

  /*

    INITIALIZE LOCATION

  */
  var loc = Location.createFromDataAttribute( document.getElementById("location") ),
  locationPhotosJSON = JSON.parse( document.getElementById("location-photos").getAttribute("data-json") ),
  locationPhotos = new PhotosCollection(locationPhotosJSON);

  loc.setUser(TA.currentUser);

  /* INTIALIZE PHOTO EDIT */

  var edit = new PhotoEditView({
    el:document.getElementById("location-photos"),
    collection:locationPhotos
  }).render();

  

  /* 

    INITIALIZE PHOTOS 

  */

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



})