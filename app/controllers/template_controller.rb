class TemplateController < ApplicationController
	def load
		method = "initialize_#{params[:path]}"
		send(method) if respond_to?(method)
		render :template => "templates/#{params[:path]}", :layout => false
	end

	protected
	def initialize_photo_grid
		limit = params[:page].nil? ? 1 : params[:limit].to_i
		page = params[:page].nil? ? 1 : params[:page].to_i

		offset = limit * page

		user = User.find_by_slug(params[:user_id])

		if( params[:trip_id] )
			trip = user.trips.find_by_slug(params[:trip_id])
		end

		photo_context = trip || user

		@photos = photo_context.photos.limit(limit).order("id ASC").offset(offset)
	end

	def initialize_photo_dialog
		@user = User.find_by_slug(params[:user_id])
		@photo = @user.photos.find_by_slug(params[:photo_id])
	end

	def initialize_location_infowindow
		@location = Location.find(params[:trip_id])
	end
end