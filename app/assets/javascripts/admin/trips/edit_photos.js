window.addEventListener("DOMContentLoaded", function () {
  if( !/admin\-trips\-edit_photos/.test(document.body.className) ) { return }

  /*

    INITIALIZE LOCATION

  */
  var trip = Trip.createFromDataAttribute( document.getElementById("trip") ),
  locationPhotosJSON = JSON.parse( document.getElementById("trip-photos").getAttribute("data-json") ),
  locationPhotos = new PhotosCollection(locationPhotosJSON);

  trip.setUser(TA.currentUser);

  /* INTIALIZE PHOTO EDIT */

  var edit = new PhotoManager({
    el:document.getElementById("trip-photos"),
    collection:locationPhotos
  })

  edit.on("photos_processed", function (event) {
    var messageElem = document.getElementById("server-messages"),
    singular = "photo",
    plural = "photos",
    insert = "",
    message = "Success! ";
    if( event.numEdited > 0 ) { 
      insert = event.numEdited === 1 ? singular : plural;
      message += event.numEdited + " " + insert + " saved. ";
    } 

    if( event.numDeleted > 0 ) {
      insert = event.numEdited === 1 ? singular : plural;
      message += event.numDeleted + " " + insert + " deleted.";
    }

    if( !/success/.test(messageElem.className) ) {
      messageElem.className += " success";
    }
    messageElem.innerHTML = message;

  })

  edit.render();

  /* 

    INITIALIZE PHOTOS 

  */

  locationPhotos.each(function (photo) {
    photo.setTrip(trip);
    var form = new PhotoForm({
      model:photo,
      el:document.getElementById("photo-" + photo.id)
    }).render();
    form.on("removed", function (e) {
      locationPhotos.remove(e.form.model);
    });
  });



})