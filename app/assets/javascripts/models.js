var MissingUserException = function ( message ) {
 this.message = message
 }

var LocationType = Backbone.Model.extend({
 initialize: function () {
  if( this.has("user") ) {
   var user_id = this.get("user").id
   this.set({user_id:user_id, user:null}, {silent:true})
  }
  this.validate(this.attributes)
 },
 validate: function ( options ) {
  if( !options.user_id ) {
   throw new MissingUserException("User need to be specified") 
  } 
 } 
 })

var User = Backbone.Model.extend({
 
 })











var Location = Backbone.Model.extend({
       idAttribute:"ID",
       initialize: function (json) {
        this.has_visited = json.has_visited == "1"
       },
       journal_entries: function ( callbacks ) {
         var loc = this
         callbacks = callbacks || {}
         if(!loc._journal_entries) {
           loc._journal_entries = []
         $.ajax({
           url: "/wp-admin/admin-ajax.php",
           data: {
             action:"journal_from_location",
             location_id:loc.get("ID")
           },
           success: function (e) {
            $.each(JSON.parse(e), function (idx, json) {
              loc._journal_entries.push(new JournalEntry(json))
            })
            if( callbacks.success ) { callbacks.success(loc._journal_entries) }
           },
           error: function () {
 
           }
         })
         } else {
           if( callbacks.success ) { callbacks.success(loc._journal_entries) }
         }
       },
       photos: function( callbacks ) {
         var loc = this
         callbacks = callbacks || {}
         $.ajax({
           url:"http://api.flickr.com/services/rest",
           dataType:"jsonp",
           data: {
             api_key:"951c0814caade8b4fc2b381778269126",
             method: "flickr.photosets.getPhotos",
             format:"json",
             photoset_id:loc.get("flickr_set")
           },
           jsonpCallback:"jsonFlickrApi",
           success:function (e) {
             var photos = []
             if( e.photoset ) {
             $.each(e.photoset.photo, function (idx, e) {
                 e.url = function () {
                 return "http://farm" + e.farm + ".static.flickr.com/" + e.server + "/" + e.id + "_" + e.secret + ".jpg"
                 } 
                 e.thumbnail = function (size) { 
                 var ary = e.url().split("."),
                     index = ary.length - 2
                   ary[index] = ary[index] + "_" + size
                   return ary.join(".");
                 }
                 photos.push(e)
               })
             }
             if( callbacks.success ) { callbacks.success(photos) }
           }
         })
       },
       navigate: function () {
         map.router.navigateToLocation(this)
       }
     })

     var JournalEntry = Backbone.Model.extend({})

var Climb = Location.extend({})
var Drive = Location.extend({})
      Blog = {
        PostTypes: {
         "vacations": {
          className: Location
         },
         "drives": {
          className: Drive
         },
         "climbs": {
          className: Climb
         }
        }
      }
