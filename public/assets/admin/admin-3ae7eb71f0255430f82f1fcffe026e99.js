function GeocodeDecoder(){function t(e){var t,n,r,i=e[0];return i?(e[0].address_components.forEach(function(e){e.types.forEach(function(i){i=="locality"?t=e.long_name:i=="administrative_area_level_1"?n=e.long_name:i=="country"&&(r=e.long_name)})}),{city:t,state:n,country:r}):{country:"",state:"",city:""}}var e=new google.maps.Geocoder;return this.decode=function(n,r){r=r||{},e.geocode({latLng:n},function(e,n){if(e){var i=t(e);r.success&&r.success({data:i,geoString:function(){if(i.city&&i.state&&i.country)return i.city+", "+i.state+", "+i.country;if(i.city&&i.country)return i.city+", "+i.country;if(i.state&&i.country)return i.state+", "+i.country;if(i.country)return i.country}})}return!1})},this}var AdminTemplate=Template.extend({load:function(e){var t=this,n=this.get("params")||{};e=e||{},$.ajax({url:t.get("user").url({includeFormat:!1})+"/template/"+t.id,data:n,success:function(t){var n=document.createElement("div");n.innerHTML=t,e.success&&e.success(n)}})}}),CityField=Backbone.View.extend({initialize:function(){var e=this,t=e.model;t.on("change",function(t,n){n.changes.city&&e._updateFormField()}),e.options.input.addEventListener("change",function(e){t.set("city",e.currentTarget.value)})},_updateFormField:function(){var e=this.model,t=e.get("city"),n=this.options.input;n.innerHTML=t}}),CountryField=Backbone.View.extend({initialize:function(){var e=this,t=this.el.querySelectorAll("datalist option");countryJson=[],e.span=e.el.querySelector("span"),[].forEach.call(t,function(e){var t=JSON.parse(e.getAttribute("data-json"));countryJson.push(t)}),e.collection=new CountryCollection(countryJson),e.model.on("change",function(t,n){var r="";if(n.changes.country_id){var i=e.collection.get(e.model.get("country_id"));i?(r=i.get("name"),e.span.innerHTML=r):e.span.innerHTML=""}})}}),FlickrDialog=ModalDialog.extend({__bindFlickrClicks:function(){var e=this,t=this.view.getElementsByClassName("flickr-set");for(var n=0;n<t.length;n+=1){var r=t[n];r.addEventListener("click",function(t){e.close(),e.trigger("photoset_click",{photoset:JSON.parse(t.currentTarget.getAttribute("data-set"))})})}},render:function(){var e=this,t=new AdminTemplate({id:"flickr_photos",user:TA.currentUser});return t.load({success:function(t){e.setView(t),e.__bindFlickrClicks(),ModalDialog.prototype.render.call(e),e.trigger("load")}}),this}});window.addEventListener("DOMContentLoaded",function(){if(!/admin\-users\-me\s/.test(document.body.className))return;[].forEach.call(document.getElementsByClassName("trip"),function(e){var t=Trip.createFromDataAttribute(e),n=e.getElementsByClassName("remove").item(0),r=e.getElementsByClassName("trip-title").item(0),i=e.getElementsByClassName("trip-date").item(0);t.setUser(TA.currentUser)})});var Location=Location.extend({editUrl:function(){return this.url()},editPhotosUrl:function(){return this.user.url({includeFormat:!1})+"/"+this.get("slug")+"/photos/edit"},newPhotosUrl:function(){return this.user.url({includeFormat:!1})+"/"+this.get("slug")+"/photos/new"}});window.addEventListener("DOMContentLoaded",function(){if(!/admin\-locations\-edit\s/.test(document.body.className))return;var e=Location.createFromDataAttribute(document.getElementById("location")),t=Trip.createFromDataAttribute(document.getElementById("location"),"data-trip"),n=new LocationMap({model:e,el:document.getElementById("location-map"),draggable:!0,autoSave:!0});(new AutoSaveTextField({model:e,property:"title",el:document.getElementById("location-title")})).render(),e.on("change",function(t,n){if(n.changes.latitude||n.changes.longitude)document.getElementById("location-geo").innerHTML=e.geoString({includeTitle:!1})}),t.setUser(TA.currentUser),e.setTrip(t),n.render(),n.startEdit(),e.on("change",function(t,n){(n.changes.latitude||n.changes.longitude)&&e.save({})})}),window.addEventListener("DOMContentLoaded",function(){if(!/admin\-locations\-new\s/.test(document.body.className))return;var e=new Location,t=Trip.createFromDataAttribute(document.getElementById("location"),"data-trip"),n=(new UserFeedback({el:document.getElementById("messages")})).render();t.setUser(TA.currentUser),e.setTrip(t);var r=(new LocationMap({model:e,el:document.getElementById("google-map")})).render();r.startEdit(),e.on("change",function(t,n){if(n.changes.latitude||n.changes.longitude)document.getElementById("location-geo").innerHTML=e.geoString({includeTitle:!1})}),document.getElementById("location-title").addEventListener("keyup",function(t){e.set({title:t.currentTarget.value})}),document.getElementById("location-save").addEventListener("click",function(t){t.preventDefault();if(!e.get("latitude")||!e.get("longitude")){n.showError("Please select a location on the map.");return}e.save({},{success:function(){window.location.href=e.editUrl()},error:function(e,t){n.showError("There was a problem with your request. Please try again in a few minutes.")}})})}),window.addEventListener("DOMContentLoaded",function(){if(!/admin\-maps\-edit\s/.test(document.body.className))return;var e=Map.createFromDataAttribute(document.getElementById("map")),t=Trip.createFromDataAttribute(document.getElementById("map"),"data-trip");t.setUser(TA.currentUser),tripMap=new TripMap({model:t,el:document.getElementById("google-map")}),t.setMaps(new Backbone.Collection([e])),tripMap.render().drawMaps(),(new AutoSaveTextField({el:document.getElementById("map-title"),model:e,property:"title"})).render()}),window.addEventListener("DOMContentLoaded",function(){if(!/admin\-maps\-index\s/.test(document.body.className))return;var e=document.getElementsByClassName("map");[].forEach.call(e,function(e){var t=Map.createFromDataAttribute(e),n=Trip.createFromDataAttribute(document.getElementById("trip")),r=e.getElementsByClassName("google-map").item(0),i=e.getElementsByClassName("map-title").item(0),s=e.getElementsByClassName("map-description").item(0),o=e.getElementsByClassName("date-field").item(0),u=new GoogleMap({el:r});n.setUser(TA.currentUser),t.setTrip(n),(new DynamicTextarea({el:s})).render(),(new DynamicTextarea({el:i})).render(),(new AutoSaveTextField({model:t,el:i,property:"title"})).render(),(new AutoSaveTextField({model:t,el:s,property:"description"})).render(),(new DateField({el:o,model:t,autoUpdate:!0})).render(),u.render(),u.drawMap(t);var a=e.getElementsByClassName("remove").item(0);a.addEventListener("click",function(){confirm("Delete map? This cannot be undone.")&&t.destroy({success:function(){e.parentNode.removeChild(e)}})})})}),window.addEventListener("DOMContentLoaded",function(){if(!/admin\-maps\-new\s/.test(document.body.className))return;var e=Trip.createFromDataAttribute(document.getElementById("trip")),t=new Map;input=(new FileInput({el:document.getElementById("map-input"),input:document.getElementById("map-input-button"),dropTarget:document})).render(),loading=(new Loading({el:document.body})).render(),input.setAllowedExtensions(["kml"]),e.setUser(TA.currentUser),t.setTrip(e),t.drawGoogleMap(document.getElementById("google-map")),document.getElementById("map-title").addEventListener("keyup",function(e){t.set({title:e.currentTarget.value})}),(new DateField({el:document.getElementsByClassName("map-date").item(0),model:t})).render(),document.getElementById("map-save").addEventListener("click",function(n){n.preventDefault(),loading.setMessage("Saving map..."),loading.loading(),t.saveWithXML({success:function(t){window.location.href=e.mapsUrl()}})}),input.on("file_added",function(){var n;return function(r){n&&n.setMap&&n.setMap(null),t.setTrip(e),t.attachFile(r.file),loading.setMessage("Parsing Map..."),loading.loading(),t.stageXML({success:function(e){n=new google.maps.KmlLayer(e.url),n.setMap(t.googleMap()),loading.doneLoading()}})}}())});var Location=Location.extend({editUrl:function(){return this.url()},editPhotosUrl:function(){return this.user.url({includeFormat:!1})+"/"+this.get("slug")+"/photos/edit"},newPhotosUrl:function(){return this.user.url({includeFormat:!1})+"/"+this.get("slug")+"/photos/new"}}),Post=Post.extend({url:function(){return this.isNew()?this.user().url()+"/posts":this.user().url()+"/posts/"+this.get("slug")}}),PhotoForm=Backbone.View.extend({__bindRemoveButton:function(){var e=this,t=this.model,n=this.el.getElementsByClassName("delete").item(0);n.addEventListener("click",function(t){confirm("Delete photo?")&&(e.el.parentNode.removeChild(e.el),e.trigger("removed",{form:e}))})},__bindTitleInput:function(){var e=this.model,t=this.el.getElementsByClassName("photo-title").item(0);(new AutoSaveTextField({model:e,el:t,property:"title"})).render(),(new DynamicTextarea({el:t})).render()},__bindDescriptionInput:function(){var e=this.model,t=this.el.getElementsByClassName("photo-description").item(0);(new AutoSaveTextField({model:e,el:t,property:"description"})).render(),(new DynamicTextarea({el:t})).render()},render:function(){return this.__bindTitleInput(),this.__bindDescriptionInput(),this.__bindRemoveButton(),this}}),PhotoUploader=Backbone.View.extend({initialize:function(){var e=this;this.files=new Backbone.Collection,this.files.on("add",function(t){e.previewPhoto(t),e.el.className.indexOf("has-photos")===-1&&(e.el.className+=" has-photos")}),this.files.on("reset",function(t){e.options.previewElem=""}),this.files.on("remove",function(t){e.removePreview(t),e.files.length===0&&(e.el.className=e.el.className.replace("has-photos",""))})},clear:function(){this.files.reset()},addImage:function(e){e.id=e.src,this.addPhotos([e])},uploadFiles:function(){function o(n){var r=e.files.at(n),u=new FormData;r.getRaw()instanceof Element?u.append("photo[url]",r.getRaw().getAttribute("src")):u.append("photo[binary]",r.getRaw()),r.get("title")&&u.append("photo[title]",r.get("title")),r.get("description")&&u.append("photo[title]",r.get("description"));var a=new XMLHttpRequest;a.open("POST",e.model.url()+"/photos"),a.onload=function(u){t.push(r),i.innerHTML="Uploaded "+t.length+" of "+e.files.length,s.setAttribute("value",t.length),t.length==e.files.length?e.trigger("photos_uploaded",{photos:e.files}):o(n+1)},a.send(u)}var e=this,t=[],n=(new Loading({el:document.body})).render(),r=document.createElement("div"),i=document.createElement("h5"),s=document.createElement("progress");e.options.uploadButton&&(e.options.uploadButton.setAttribute("disabled","disabled"),e.options.clearButton.setAttribute("disabled","disabled")),e.trigger("upload_start"),s.setAttribute("value",0),s.setAttribute("max",e.files.length),i.innerHTML="Uploaded 0 of "+e.files.length,r.appendChild(i),r.appendChild(s),n.setLoadingView(r),n.loading(),o(0)},removePreview:function(e){var t=this.options.previewElem.querySelector("#"+this.generatePhotoPreviewId(e));t.parentNode.removeChild(t)},previewPhoto:function(){function n(n){e.push(n),t||(i.call(this,e[0]),t=!0)}function r(){e.shift(),e.length===0?t=!1:i.call(this,e[0])}function i(e){var t=this,n=t.generatePreviewHTML(e),i=document.createElement("img"),s=e.src();i.onload=function(){var e=n.canvas.getContext("2d"),s=i.height/i.width,o=125,u=o*s;if(i.height>i.width||u<90)u=90,o=u*(1/s);n.canvas.height=u,n.canvas.width=o,e.drawImage(i,0,0,o,u),r.call(t)},canvas.width=100,canvas.height=100,n.div.appendChild(canvas),i.src=s}var e=[],t=!1;return n}(),generatePhotoPreviewId:function(e){return"image-preview-"+e.cid},generatePreviewHTML:function(e){var t=this,n=t.generatePhotoPreviewId(e);return div=document.createElement("div"),canvas=document.createElement("canvas"),remove=document.createElement("a"),remove.className="remove",remove.addEventListener("click",function(){t.files.remove(e)}),div.className="image-upload",div.id=n,div.appendChild(remove),t.options.previewElem.appendChild(div),{div:div,canvas:canvas}},allowedExtensions:function(){return["jpg","jpeg","png","gif"]},validateFile:function(e){var t=this.allowedExtensions(),n=e.name.split("."),r=n[n.length-1];if(!r){debugger;return!1}for(var i in t){var s=new RegExp(t[i]);if(s.test(r.toLowerCase()))return!0}return!1},addPhotos:function(e){for(var t=0;t<e.length;t+=1)if(this.validateFile(e[t])){var n=new Photo(e[t]);this.addPhoto(n)}},addPhoto:function(e){this.files.add(e)},__setupInput:function(){var e=this;e.options.input.addEventListener("change",function(t){var n,r=t.currentTarget.files;e.addPhotos(r)})},__setupDropTarget:function(){if(!this.options.dropTarget)return;(function(e){e.el.addEventListener("dragenter",function(t){e.el.className+=" dragenter"}),e.el.addEventListener("dragleave",function(t){e.el.className=e.el.className.replace("dragenter","")}),e.options.dropTarget.addEventListener("drop",function(t){t.stopPropagation(),t.preventDefault(),e.el.className=e.el.className.replace("dragenter",""),e.addPhotos(t.dataTransfer.files)},!1)})(this)},__bindUploadButton:function(){var e=this;this.options.uploadButton.addEventListener("click",function(t){e.uploadFiles()})},__bindClearButton:function(){var e=this;this.options.clearButton.addEventListener("click",function(t){e.clear()})},render:function(){this.__setupDropTarget(),this.__setupInput(),this.__bindUploadButton(),this.__bindClearButton()}});window.addEventListener("DOMContentLoaded",function(){if(!/admin\-posts\-index\s/.test(document.body.className))return;var e=Trip.createFromDataAttribute(document.getElementById("journals"),"data-trip");e.setUser(TA.currentUser),[].forEach.call(document.getElementsByClassName("journal"),function(t){var n=Journal.createFromDataAttribute(t),r=t.getElementsByClassName("date-field").item(0),i=t.getElementsByClassName("journal-title").item(0),s=t.getElementsByClassName("remove").item(0);n.setTrip(e),(new DynamicTextarea({el:i})).render(),(new AutoSaveTextField({el:i,model:n,property:"title"})).render(),(new DateField({el:r,model:n,autoUpdate:!0})).render(),s.addEventListener("click",function(){confirm("Delete "+n.get("title")+"? This cannot be undone")&&n.destroy({success:function(){t.parentNode.removeChild(t)}})})})}),window.addEventListener("DOMContentLoaded",function(){if(!/admin\-posts\-new\s/.test(document.body.className))return;var e=new Post,t=Trip.createFromDataAttribute(document.getElementById("post"),"data-trip");e.setUser(TA.currentUser),t&&(t.setUser(TA.currentUser),e.setTrip(t));var n=new PostForm({model:e,saveButton:document.getElementById("post-save"),titleField:document.getElementById("post-title"),bodyField:document.getElementById("post-body")});n.on("post_save",function(){e.save({},{success:function(){window.location.href=e.url()}})});var r=new DateField({el:document.getElementsByClassName("post-date").item(0),model:e});r.render(),n.render()}),window.addEventListener("DOMContentLoaded",function(){function r(){tinyMCE.init({mode:"exact",elements:"post-body",theme:"advanced",theme_advanced_buttons1:"bold,italic,underline,|,link,unlink,|,bullist,blockquote,undo",setup:function(e){e.onChange.add(function(){var e;return function(n,r){e&&clearTimeout(e),setTimeout(function(){t.save({body:n.getContent()})},500)}}())}})}if(!/\sposts\-show\s/.test(document.body.className))return;var e=document.getElementById("post"),t=Post.createFromDataAttribute(e);t.setUser(TA.currentUser),deleteEl=document.getElementById("post-delete"),editEl=document.getElementById("post-body-edit"),deleteEl.addEventListener("click",function(e){e.preventDefault(),confirm("Delete "+t.get("title")+"? This cannot be undone")&&t.destroy({success:function(){window.location.href="/"}})}),t.set({body:document.getElementById("post-body").innerHTML},{silent:!0}),(new AutoSaveTextField({model:t,el:document.getElementById("post-title"),property:"title"})).render();var n=new DateField({el:document.getElementsByClassName("post-date").item(0),model:t});n.render(),t.on("change",function(e,n){(n.changes.start_date||n.changes.end_date)&&t.save({})}),editEl.addEventListener("click",function(e){e.preventDefault(),r()})});var TripPhotoDialog=ModalDialog.extend({bindImageClicks:function(){var e=this;[].forEach.call(this.view.getElementsByClassName("photo"),function(t){var n=Photo.createFromDataAttribute(t);n.setUser(e.model.user()),t.addEventListener("click",function(){e.trigger("photo_click",{photo:n})})})},render:function(){var e=this,t=new AdminTemplate({user:TA.currentUser,id:"trip_photos",params:{trip_id:e.model.get("slug")}});return e.setTitle("Select photo for "+e.model.get("title")),t.load({success:function(t){e.setView(t),e.bindImageClicks(),ModalDialog.prototype.render.call(e)}}),e}});window.addEventListener("DOMContentLoaded",function(){if(!/admin\-trips\-edit_locations\s/.test(document.body.className))return;var e=Trip.createFromDataAttribute(document.getElementById("trip")),t=LocationsCollection.createFromDataAttribute(document.getElementById("trip"),"data-locations");e.setUser(TA.currentUser),e.setLocations(t),t.each(function(e){e.on("change",function(t,n){(n.changes.longitude||n.changes.longitude)&&e.save({})})});var n=new TripMap({model:e,el:document.getElementById("trip-map")});n.on("location_click",function(e){var r=e.location;t.each(function(e){if(e===r||!e.infowindow)return;e.infowindow.hide()}),r.infowindow||(r.infowindow=(new LocationInfowindow({model:r,map:n.googleMap()})).render(),r.infowindow.on("html_load",function(e){var t=e.html;(new AutoSaveTextField({el:t.getElementsByClassName("location-title").item(0),model:r,property:"title"})).render()})),r.infowindow.toggle()}),n.render(),n.drawLocations(),n.startEdit(),t.on("add",function(t){t.setTrip(e),t.save({})})}),window.addEventListener("DOMContentLoaded",function(){if(!/admin\-trips\-edit_photos/.test(document.body.className))return;var e=Trip.createFromDataAttribute(document.getElementById("trip"));e.setUser(TA.currentUser),[].forEach.call(document.getElementsByClassName("photo"),function(t){var n=Photo.createFromDataAttribute(t);n.setTrip(e);var r=new PhotoForm({model:n,el:t});r.on("removed",function(){n.destroy()}),r.render()})}),window.addEventListener("DOMContentLoaded",function(){if(!/admin\-trips\-new\s/.test(document.body.className))return;var e=new Trip,t=(new UserFeedback({el:document.getElementById("form-message")})).render(),n=document.getElementById("trip-summary");e.setUser(TA.currentUser);var r=new DateField({el:document.getElementsByClassName("trip-date").item(0),model:e});r.render();var i=new TripMap({model:e,el:document.getElementById("google-map")});i.on("location_click",function(e){var t=e.location;t.infowindow||(t.infowindow=(new LocationInfowindow({model:t,map:i.googleMap()})).render(),t.infowindow.on("html_load",function(e){var n=e.html,r=n.getElementsByClassName("location-title").item(0);r.addEventListener("keyup",function(e){t.set({title:e.currentTarget.value})})})),t.infowindow.toggle()}),i.render(),i.startEdit(),document.getElementById("trip-title").addEventListener("keyup",function(t){e.set({title:t.currentTarget.value})}),n.addEventListener("keyup",function(t){e.set({summary:t.currentTarget.value})}),e.on("error",function(e,n){n.title&&t.showError("Please title your trip")}),document.getElementById("trip-save").addEventListener("click",function(n){n.preventDefault();if(e.locations().length===0){t.showError("Please select at least one location");return}e.saveWithLocations({success:function(){window.location.href=e.editUrl()}})})}),window.addEventListener("DOMContentLoaded",function(){if(!/admin\-photos\-new/.test(document.body.className))return;var e=Trip.createFromDataAttribute(document.getElementById("trip"));e.setUser(TA.currentUser);var t=new PhotoUploader({model:e,el:document.getElementById("photo-upload"),input:document.querySelector("#photo-upload input"),previewElem:document.getElementById("photo-container"),dropTarget:document,uploadButton:document.getElementById("save-photos"),clearButton:document.getElementById("clear-photos")});t.on("photos_uploaded",function(t){window.location.href=e.editPhotosUrl()}),t.render();var n=document.getElementById("photo-upload-flickr"),r=new FlickrDialog;r.setTitle("Import photos from Flickr"),r.on("photoset_click",function(e){TA.currentUser.flickrset_photos(e.photoset.id,{success:function(e){var n=e.photo;for(var r=0;r<n.length;r+=1)(function(e,n){var r=new Image;r.onload=function(n){var i=new Photo;e.get("title")&&i.set({title:e.get("title")}),e.get("description")&&i.set({title:e.get("description")}),i.setRaw(r),t.addPhoto(i)},r.src=e.url()})(new FlickrImage(n[r]),e)}})}),n.addEventListener("click",function(e){if(/auth\/flickr/.test(n.getAttribute("href")))return;e.preventDefault();var t=new Loading({el:document.body}),i=document.createElement("span");i.innerHTML="Loading flickr photos",t.render(),t.setLoadingView(i),t.loading(),r.on("load",function(){t.doneLoading()}),r.render()}),/\?flickr/.test(window.location.href)&&r.render()}),window.addEventListener("DOMContentLoaded",function(){if(!/\strips\-show\s/.test(document.body.className))return;var e=Trip.createFromDataAttribute(document.getElementById("trip")),t=LocationsCollection.createFromDataAttribute(document.getElementById("trip"),"data-locations"),n=MapsCollection.createFromDataAttribute(document.getElementById("trip"),"data-maps");e.setUser(TA.currentUser),e.setLocations(t),e.setMaps(n),document.getElementById("trip-delete").addEventListener("click",function(t){t.preventDefault(),confirm("Delete "+e.get("title")+"? This cannot be undone.")&&e.destroy({success:function(){window.location.href="/"}})});var r=new DateField({el:document.getElementsByClassName("trip-date").item(0),model:e});r.render(),(new TripMap({model:e,el:document.getElementById("trip-locations-map")})).mergeMapOptions({disableDefaultUI:!0,draggable:!1}).render().drawLocations(),(new TripMap({model:e,el:document.getElementById("admin-trip-maps")})).mergeMapOptions({disableDefaultUI:!0,draggable:!1}).render().drawMaps(),(new AutoSaveTextField({model:e,el:document.getElementById("trip-title"),property:"title"})).render(),(new AutoSaveTextField({model:e,el:document.getElementById("trip-summary"),property:"summary"})).render();var i=document.getElementById("change-trip-photo");i&&i.addEventListener("click",function(t){t.preventDefault();var n=new TripPhotoDialog({model:e});n.on("photo_click",function(t){e.setPhoto(t.photo),e.save({},{success:function(){n.close()}})}),n.render()}),e.on("change",function(t,n){if(n.changes.photo_id){var r=document.getElementById("trip-image");r.setAttribute("src",e.photo().source())}(n.changes.start_date||n.changes.end_date)&&e.save({})})});var UserImage=Backbone.View.extend({determinePhotoUrl:function(e){var t=this.el.getAttribute("data-photo-size")||"url";return e[t]()},render:function(){var e=this,t;this.model.on("change",function(n,r){if(r.changes.photo_url){t=UserPhoto.initFromUrl(e.model.get("photo_url"));var i=e.determinePhotoUrl(t);e.el.setAttribute("src",i)}})}}),UserImageField=Backbone.View.extend({__bindServiceClicks:function(){var e=this,t,n=e.dialogView.getElementsByTagName("li"),r;for(t=0;t<n.length;t++)r=n[t],r.addEventListener("click",function(t){var n=t.currentTarget.getAttribute("data-service"),r=t.currentTarget.getAttribute("data-service_id");n!="gravatar"?e.setImageSource({service:n,serviceId:r}):n=="gravatar"&&e.showEmailField()})},showEmailField:function(){var e=this,t=e.dialogView.querySelector(".gravatar"),n=e.dialogView.querySelector(".email");t.className+=" expanded",e.dialogView.querySelector(".button").addEventListener("click",function(n){n.preventDefault(),n.stopPropagation(),t.className=t.className.replace(" expanded",""),e.setImageSource({service:"gravatar",serviceId:e.dialogView.querySelector(".email").querySelector("input[type=email]").value})})},setImageSource:function(e){var t=this,n=UserPhoto.init({service:e.service,serviceId:e.serviceId});t.userImage.setAttribute("src",n.large()),t.model.set({photo_url:n.url()})},launchPhotoPicker:function(){var e=this,t=new AdminTemplate({user:this.model,id:"user_picture_field"});e.dialog=new ModalDialog({onclose:function(){e.dialogClose()}}),t.load({success:function(t){e.dialogView=t,e.dialog.setView(e.dialogView),e.dialog.render(),e.userImage=e.dialogView.querySelector(".user-image img"),e.userImage.addEventListener("load",function(){e.dialog.autocenter()}),e.dialogView.querySelector(".save").addEventListener("click",function(){e.model.save({},{success:function(){e.__didSave=!0,e.dialog.close()}})}),e.__bindServiceClicks()}})},dialogClose:function(){if(this.__didSave===!0)return;this.model.set({photo_url:this.__originalUserPhoto})},render:function(){var e=this;e.__originalUserPhoto=this.model.get("photo_url"),e.el.addEventListener("click",function(t){e.launchPhotoPicker()})}}),UserLocationField=Backbone.View.extend({initialize:function(){var e=this;e.modal=new ModalDialog({parentElem:document.body}),e.modal.setTitle("Select your home location"),e.marker=new google.maps.Marker},showMap:function(){var e=this,t=e.model,n=new AdminTemplate({user:this.model,id:"user_location_field"});n.load({success:function(n){e.dialogView=n;var r=n.querySelector("figure");e.modal.setView(n),e.modal.render(),e.map=new google.maps.Map(r,{zoom:4,center:new google.maps.LatLng(t.get("latitude")||0,t.get("longitude")||0),mapTypeId:google.maps.MapTypeId.HYBRID}),t.get("latitude")!=0&&t.get("longitude")!=0&&e.marker.setOptions({position:new google.maps.LatLng(t.get("latitude"),t.get("longitude")),map:e.map,title:t.get("title")}),e._bindMapClicks(),e._bindSaveButtonClick()}})},_bindSaveButtonClick:function(){var e=this,t=e.model,n=new GeocodeDecoder;e.dialogView.querySelector(".save").addEventListener("click",function(){n.decode(e.marker.position,{success:function(n){if(n.data){var r=e.options.countries.findByName(n.data.country),i=r?r.id:"";t.set({country_id:i,city:n.data.city||""}),t.save({},{success:function(){e.modal.close()}})}}}),t.set({latitude:e.marker.position.lat(),longitude:e.marker.position.lng()})})},_bindMapClicks:function(){var e=this,t=e.model;google.maps.event.addListener(e.map,"click",function(t){e.marker.setOptions({map:e.map,position:t.latLng})})},render:function(){var e=this;return e.model.on("change",function(t,n){if(n.changes.country_id||n.changes.city){var r=e.options.countries.get(e.model.get("country_id"));e.el.innerHTML=e.model.get("city")+", "+r.get("name")}}),this.el.addEventListener("click",function(t){e.showMap()}),e}}),UserSlugField=Backbone.View.extend({render:function(){var e=this;this.el.addEventListener("keyup",function(t){User.validateSlug(t.currentTarget.value,{success:function(t){e.model.set({slug:t.slug})}})})}}),AutoSaveTextField=Backbone.View.extend({elIsInput:function(){return this.el.tagName.toLowerCase()==="input"||this.el.tagName.toLowerCase()==="textarea"},__bindKeyUp:function(){var e=this,t=null;this.elIsInput()||(e.el.contentEditable=!0),e.el.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation()}),e.el.addEventListener("keyup",function(n){var r=n.currentTarget,i=e.elIsInput()?r.value:r.innerHTML;e.model.set(e.options.property,i),t&&clearTimeout(t),t=setTimeout(function(){e.model.save({},{success:function(){e.trigger("model_save",{model:e.model})}})},500)})},render:function(){return this.__bindKeyUp(),this}}),DateField=Backbone.View.extend({initialize:function(){this._defaultDate=(new Date).toUTCString()},kalendae:function(){return this._kalendae},_kalendaeOptions:function(){return{mode:"range",format:"MMMM DD, YYYY",useYearNav:!1,months:2}},__buildKalendae:function(){var e=this,t=this.el.getElementsByTagName("input")[0];this._kalendae=new Kalendae.Input(t,this._kalendaeOptions()),this._bindKalendaeEvents()},_bindKalendaeEvents:function(){var e=this;this.kalendae().subscribe("show",function(t){var n=e.kalendae().container.getElementsByClassName("k-btn-close").item(0);n.addEventListener("click",function(){e.kalendae().hide(),e.trigger("kalendae_close")})}),this.kalendae().subscribe("change",function(t){e._updateModel(e._kalendae.getSelectedAsDates())})},_updateModel:function(e){var t={start_date:null,end_date:null};e[0]&&(t.start_date=moment(e[0]).format("YYYY-MM-DD")),e[1]&&(t.end_date=moment(e[1]).format("YYYY-MM-DD")),this.model.set(t),this.options.autoUpdate&&this.model.save({}),this.trigger("model_set")},updateLabel:function(){var e=this.model.get("start_date"),t="";this.model.get("start_date")&&(t=moment(e).format(this._kalendaeOptions().format));if(this.model.get("end_date")){var n=this.model.get("end_date");t+=" - "+moment(n).format(this._kalendaeOptions().format)}this.__updateClassName(),this.el.getElementsByClassName("date-str")[0].innerHTML=t},defaultDate:function(){return this._defaultDate},setDefaultDate:function(e){e instanceof Date?this._defaultDate=e.toUTCString():new Date(e)!="Invalid Date"&&(this._defaultDate=(new Date(e)).toUTCString())},__updateClassName:function(){!this.model.get("start_date")&&!this.model.get("end_date")?this.el.className=this.el.className.replace(" has-date",""):/has\-date/.test(this.el.className)||(this.el.className+=" has-date")},__bindElem:function(){var e=this;this.el.addEventListener("click",function(t){t.preventDefault(),e.kalendae().show(),e.trigger("click")})},__bindClear:function(){var e=this,t=this.el.getElementsByClassName("reset").item(0);t.addEventListener("click",function(t){t.preventDefault(),t.stopPropagation(),e._updateModel([]),e.kalendae().setSelected("")})},render:function(){var e=this;return this.__buildKalendae(),this.__bindElem(),this.__bindClear(),this.__updateClassName(),this.model.on("change",function(t,n){(n.changes.start_date||n.changes.end_date)&&e.updateLabel()}),this}}),FileInput=Backbone.View.extend({initialize:function(){var e=this;this._allowedExtensions=[],this.files=[]},clear:function(){this.files.reset()},setAllowedExtensions:function(e){this._allowedExtensions=e},allowedExtensions:function(){return this._allowedExtensions},validateFile:function(e){var t=this.allowedExtensions();if(t.length===0)return!0;var n=e.name.split("."),r=n[n.length-1];if(!r)return!1;for(var i in t){var s=new RegExp(t[i]);if(s.test(r))return!0}return!1},addFile:function(e){this.files.push(e),this.trigger("file_added",{file:e})},addFiles:function(e){for(var t=0;t<e.length;t+=1)this.validateFile(e[t])&&this.addFile(e[t])},__setupInput:function(){var e=this;e.options.input.addEventListener("change",function(t){var n=t.currentTarget.files;e.addFiles(n)})},__setupDropTarget:function(){if(!this.options.dropTarget)return;(function(e){e.el.addEventListener("dragenter",function(t){e.el.className+=" dragenter"}),e.el.addEventListener("dragleave",function(t){e.el.className=e.el.className.replace("dragenter","")}),e.options.dropTarget.addEventListener("drop",function(t){t.stopPropagation(),t.preventDefault(),e.el.className=e.el.className.replace("dragenter",""),e.addFiles(t.dataTransfer.files)},!1)})(this)},__bindUploadButton:function(){var e=this;if(!this.options.uploadButton)return;this.options.uploadButton.addEventListener("click",function(t){e.uploadFiles()})},__bindClearButton:function(){var e=this;if(!this.options.clearButton)return;this.options.clearButton.addEventListener("click",function(t){e.clear()})},render:function(){return this.__setupDropTarget(),this.__setupInput(),this.__bindUploadButton(),this.__bindClearButton(),this}}),LocationInfoWindow=LocationInfoWindow.extend({load:function(e){e=e||{};var t=this;if(this._html&&e._html){e.success(this._html);return}var n=new AdminTemplate({id:"location_infowindow",user:TA.currentUser,params:{location_id:t.model.id}});n.load({success:function(n){t._html=n,e.success&&e.success(n),t.bindDelete(),t.trigger("html_load",{html:n})}})},bindDelete:function(){var e=this,t=_html.getElementsByClassName("location-delete").item(0);t.addEventListener("click",function(t){t.preventDefault(),confirm("Delete "+e.model.smartTitle()+"? This cannot be undone.")&&e.model.destroy()})}}),LocationMap=Backbone.View.extend({initialize:function(){var e=this,t=e.model;this.locationHash={},this.options.countryCollection=this.options.countryCollection||TA.countries},showLocationString:function(e){if(!this.options.geoElem)return;this.options.geoElem.innerHTML=e},_bindMapClicks:function(){var e=this,t=e.model,n=new GeocodeDecoder;google.maps.event.addListener(e.googleMap(),"click",function(t){n.decode(t.latLng,{success:function(n){n.data&&e.options.countryCollection.fetch({success:function(){var r=e.options.countryCollection.findByName(n.data.country);if(!r)return;e.model.set({city:n.data.city||"",state:n.data.state||"",latitude:t.latLng.lat(),longitude:t.latLng.lng()}),e.model.setCountry(r),e.showLocationString(e.model.geoString({includeTitle:!1}))}})}})})},drawMapMarker:function(){this.markerClone.render()},googleMapMarker:function(){return this._googleMapMarker},googleMap:function(){return this._googleMap},drawToMap:function(e,t){t=t||{};var n={center:this.model.latLng(),zoom:4,mapTypeId:google.maps.MapTypeId.HYBRID,scrollwheel:!1};for(var r in t)n[r]=t[r];this._googleMap=new google.maps.Map(e,n),this._googleMapMarker=new LocationMarker({model:this.
model,map:this._googleMap})},drawMap:function(e){e=e||{};var t={center:this.model.latLng(),zoom:4,mapTypeId:google.maps.MapTypeId.HYBRID,scrollwheel:!1};for(var n in e)t[n]=e[n];this._googleMap=new google.maps.Map(this.el,t),this._googleMapMarker=(new LocationMarker({model:this.model,map:this._googleMap})).render()},startEdit:function(){this.googleMapMarker().makeInteractive(),this._bindMapClicks()},doneEdit:function(){},render:function(){return this.drawMap(),this}}),LocationMarker=LocationMarker.extend({makeInteractive:function(){var e=this,t=this.marker,n=new GeocodeDecoder,r=e.options.countryCollection||TA.countries;google.maps.event.addListener(this.googleMarker,"click",function(t){e.trigger("click",{mapEvent:t})}),google.maps.event.addListener(this.googleMarker,"dragend",function(t){n.decode(t.latLng,{success:function(n){n.data&&r.fetch({success:function(){var i=r.findByName(n.data.country);if(!i)return;e.model.setCountry(i),e.model.set({city:n.data.city||"",state:n.data.state||"",latitude:t.latLng.lat(),longitude:t.latLng.lng()}),e.trigger("dragend",{mapEvent:t,politicalData:n.data,marker:e})}})}})}),this.googleMarker.setOptions({draggable:!0})}}),MapForm=Backbone.View.extend({render:function(){var e=this;return[].forEach.call(this.el.getElementsByTagName("textarea"),function(t){(new AutoSaveTextField({model:e.model,el:t,property:t.getAttribute("data-property")})).render(),(new DynamicTextarea({el:t})).render()}),(new DateField({el:e.el.getElementsByClassName("map-date").item(0),model:e.model,autoUpdate:!0})).render(),this.el.getElementsByClassName("delete").item(0).addEventListener("click",function(){confirm("Delete map?")&&e.model.destroy()}),this}}),PostForm=Backbone.View.extend({__renderTitleField:function(){var e=this;this.options.titleField.addEventListener("keyup",function(t){e.model.set({title:t.currentTarget.value})})},__bindSaveButton:function(){var e=this;this.options.saveButton.addEventListener("click",function(t){t.preventDefault();var n=tinyMCE.getInstanceById(e.options.bodyField.id).getContent();e.model.set({body:n}),e.trigger("post_save")})},__tinyMCE:function(){tinyMCE.init({mode:"textareas",theme:"advanced",theme_advanced_buttons1:"bold,italic,underline,|,link,unlink,|,bullist,blockquote,undo"})},render:function(){return this.__renderTitleField(),this.__bindSaveButton(),this.__tinyMCE(),this}}),TripMap=TripMap.extend(function(){var e=TA.countries;return{_bindMapClicks:function(){var t=this,n=t.model,r=new GeocodeDecoder;google.maps.event.addListener(t.googleMap(),"click",function(n){r.decode(n.latLng,{success:function(r){r.data&&e.fetch({success:function(){var i=e.findByName(r.data.country);if(!i)return;var s=new Location({city:r.data.city||"",state:r.data.state||"",latitude:n.latLng.lat(),longitude:n.latLng.lng()});s.setCountry(i);var o=(new LocationMarker({model:s,map:t.googleMap(),draggable:!0})).render();t.model.locations().add(s),t.makeMarkerInteractive(o)}})}})})},makeMarkerInteractive:function(e){var t=this;e.makeInteractive(),e.on("dragend",function(e){t.trigger("marker_dragend",e)}),e.on("click",function(n){n.location=e.model,t.trigger("location_click",n)})},startEdit:function(){var e=this;this._bindMapClicks(),_.each(this.markers,function(t){e.makeMarkerInteractive(t)})},doneEdit:function(){}}}()),UserFeedback=Backbone.View.extend({showError:function(e){var t=document.createElement("p");return t.innerHTML=e,t.className="error",this.el.appendChild(t),t},showSuccess:function(e){var t=document.createElement("p");return t.innerHTML=e,t.className="success",this.el.appendChild(t),t},render:function(){return this}});TA.currentUser=new User(JSON.parse(YAHOO.util.Cookie.get("user"))),window.addEventListener("DOMContentLoaded",function(){function s(t){var n=0;for(n;n<e.length;n++)(new UserLocationField({model:TA.currentUser,el:e[n],countries:r})).render()}var e=document.getElementsByClassName("user-location-button"),t=document.getElementsByClassName("user-image-button"),n=document.getElementsByClassName("user-image"),r=TA.countries,i;r.fetch({success:function(){s(e)}});for(i=0;i<t.length;i++)(new UserImageField({el:t[i],model:TA.currentUser})).render();for(i=0;i<n.length;i++)(new UserImage({el:n[i],model:TA.currentUser})).render()});