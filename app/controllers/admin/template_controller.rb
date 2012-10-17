class Admin::TemplateController < Admin::AdminController
	def load
		method = "initialize_#{params[:path]}"
		send(method) if respond_to?(method)
		render :template => "admin/templates/#{params[:path]}", :layout => false
	end

	protected
	def initialize_location_photos
		@location = current_user.locations.find_by_slug(params[:location_id])
		@photos = @location.photos
	end

	def initialize_location_map
		@location = current_user.locations.find_by_slug(params[:location_id])
	end

	def initialize_flickr_photos
		@user_flickr_sets = current_user.flickr_sets
	end
end