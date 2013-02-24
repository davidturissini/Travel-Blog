(function(user, global, jQuery, Photo, ModalDialog, InfiniteScroll) {
	'use strict';
	var post, dialog = new ModalDialog(), trip;

	post = Post.createFromDataAttribute(document.getElementById('post'));

	if (post.has('trip_id')) {
		trip = Trip.createFromDataAttribute(document.getElementById('post'), "data-trip");

		trip.setUser(user);
	}

	function renderPhotosViews (photos) {
		var compiledTemplate, photosEl, templateString = '<img src="{{photoUrl}}" />';
		compiledTemplate = Mustache.compile(templateString);

		photosEl = document.createElement('div');

		photos.forEach(function (photo) {
			var figure;

			figure = document.createElement('figure');
			figure.className = 'photo';
			figure.innerHTML = compiledTemplate({
				photoUrl:photo.source()
			});

			figure.setAttribute('data-photo_id', photo.get('id'));

			photosEl.appendChild(figure);
		});

		photosEl.className = 'photos-list';

		return photosEl;
		
	}

	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('photos');

	tinymce.create('tinymce.plugins.PhotosPlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
			ed.addCommand('mcePhotos', function() {
				var photosCollection;

				if (trip !== undefined) {
					photosCollection = trip.photos();
				} else {
					photosCollection = user.photos();
				}

				photosCollection.fetch()
				.then(function (photos, p) {
					var photosEl, infiniteScroll, infiniteUrl;
					photos = new PhotosCollection(photos);
					
					photosEl = renderPhotosViews(photos);
					dialog.setView(photosEl);
					dialog.render();

					infiniteUrl = '/template/photo_grid?user_id=' + user.get('slug');

					if (trip !== undefined) {
						infiniteUrl += '&trip_id=' + trip.get('slug');
					}

					photosEl.setAttribute('data-infinite', infiniteUrl);

					infiniteScroll = new InfiniteScroll({
						el:photosEl,
						scrollEl:photosEl
					})

					jQuery(photosEl).on('click', '.photo', function (evt) {
						var idAttr, dataAttr, imgTag, index = 0, photo;

						idAttr = evt.currentTarget.getAttribute('data-photo_id');
						dataAttr = evt.currentTarget.getAttribute('data-json');

						if (dataAttr) {
							photo = Photo.createFromDataAttribute(evt.currentTarget);
						} else {
							photo = photosCollection.get(idAttr);
						}
						
						imgTag = '<figure><img class="photo-embed" width="150" src="' + photo.source() + '" /><figcaption></figcaption></figure>';
						ed.execCommand('mceInsertContent', false, imgTag);
						dialog.close();
					})

					infiniteScroll.render();

				})
			});

			// Register example button
			ed.addButton('photos', {
				title : 'photo.desc',
				cmd : 'mcePhotos',
				image : url + '/img/youtube.gif'
			});

			// Add a node change handler, selects the button in the UI when a image is selected
			ed.onNodeChange.add(function(ed, cm, node) {
				if (node.nodeName.toLowerCase() === 'img' && jQuery.prototype.hasClass.apply([node], ['photo-embed'])) {
					node.setAttribute('align', 'right');
				}
				cm.setActive('photos', node.nodeName === 'IMG');
			});
		},

		/**
		 * Creates control instances based in the incomming name. This method is normally not
		 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
		 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
		 * method can be used to create those.
		 *
		 * @param {String} n Name of the control to create.
		 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
		 * @return {tinymce.ui.Control} New control instance or null if no control was created.
		 */
		createControl : function(n, cm) {
			return null;
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Example plugin',
				author : 'Some author',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/example',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('photos', tinymce.plugins.PhotosPlugin);
})(TA.currentUser, window, jQuery, Photo, ModalDialog, InfiniteScroll);