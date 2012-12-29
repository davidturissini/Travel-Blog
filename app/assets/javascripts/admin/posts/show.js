window.addEventListener("DOMContentLoaded", function () {
	if( !/\sposts\-show\s/.test(document.body.className) ) { return }

	var postElem = document.getElementById('post'),
	post = Post.createFromDataAttribute(postElem);
	post.setUser(TA.currentUser),
	deleteEl = document.getElementById("post-delete"),
	editEl = document.getElementById("post-edit");

	deleteEl.addEventListener("click", function (e) {
		e.preventDefault();
		if( confirm("Delete " + post.get("title") + "? This cannot be undone") ) {
			post.destroy({
				success:function () {
					window.location.href = "/";
				}
			})
		}
	})

	post.set({
		body:document.getElementById("post-body").innerHTML
	}, {silent:true});
	
	

	function initTinyMCE() {
		tinyMCE.init({
	        mode:"exact",
	        elements:"post-body",
	        theme: "advanced",
	        theme_advanced_buttons1 : "bold,italic,underline,|,link,unlink,|,bullist,blockquote,undo",
	        setup:function (ed) {
	        	ed.onChange.add((function () {
	        		var timeout;
	        		return function(ed, l) {
	        			if( timeout ) { clearTimeout(timeout); }
	        			setTimeout(function () {
			        		post.save({
			        			body:ed.getContent()
			        		})
			        	}, 500);
		        	}
	        	})())
	        }
		});
	}

	function editPost() {
		new AutoSaveTextField({
			model:post,
			el:document.getElementById("post-title"),
			property:"title"
		}).render();

		var dateField = new DateField({
			el:document.getElementsByClassName("post-date").item(0),
			model:post
		});

		dateField.render();

		var select = new TripsSelect({
			user:post.user()
		})


		post.on("change", function (e, changed) {
			if( changed.changes.start_date || changed.changes.end_date ) {
				post.save({})
			}
		})
		initTinyMCE();
	}

	editEl.addEventListener("click", function (e) {
		e.preventDefault();
		editPost();
	})

})