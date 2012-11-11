class Admin::UsersController < Admin::AdminController
	def edit_me
		@user = current_user
		respond_to do |format|
			format.html { render "admin/users/edit_me" }
		end
	end

	def me
		if validate_user? && !current_user.incomplete?
			@user = current_user
			respond_to do |format|
				format.html { render "admin/users/me" }
			end
		elsif current_user.incomplete?
			redirect_to_user_welcome
		end
	end

	def update
		params[:user_id] = current_user.slug
		params[:user][:slug].delete
		slug = params[:user_id]
		[:id, :token, :salt].each do |prop|
			params[:user].delete(prop)
		end
		current_user.update_attributes!(params[:user])
		current_user.set_slug(String.slugify(slug)) if !current_user.slug
		set_user_cookie(current_user)
		respond_to do |format|
			format.html { redirect_to :action => :me }
			format.json { render :json => current_user }
		end
	end

	def photoset_photos
		photoset_id = params[:photoset_id]
		photos = current_user.flickr_set_photos(photoset_id)
		render :json => photos
	end
end