class Admin::TemplateController < Admin::AdminController
	def load
		method = "initialize_#{params[:path]}"
		send(method) if respond_to?(method)
		render :template => "admin/templates/#{params[:path]}", :layout => false
	end

	protected
	def initialize_location_infowindow
		if params[:location_id]
			@location = Location.find(params[:location_id]) 
		else
			@location = Location.new
		end
	end

	def initialize_trip_photos
		@trip = current_user.trips.find_by_slug(params[:trip_id])
		@photos = @trip.photos
	end
	
	def initialize_flickr_photos
		@user_flickr_sets = current_user.flickr_sets
	end
end