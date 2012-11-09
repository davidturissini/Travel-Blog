class TemplateController < ApplicationController
	def load
		method = "initialize_#{params[:path]}"
		send(method) if respond_to?(method)
		render :template => "templates/#{params[:path]}", :layout => false
	end

	protected
	def initialize_photo_dialog
		@user = User.find_by_slug(params[:user_id])
		@trip = @user.trips.find_by_slug(params[:trip_id])
		@photo = @trip.photos.find_by_slug(params[:photo_id])
	end

	def initialize_location_infowindow
		@location = Location.find(params[:trip_id])
	end
end