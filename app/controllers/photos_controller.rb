class PhotosController < ApplicationController
	def index
		@user = User.find_by_slug(params[:user_id])
		@user_trips = @user.trips.includes(:photos)
		if params.has_key?(:trip_id)
			@trip = @user.trips.includes(:photos).find_by_slug(params[:trip_id])
		end

		@photos = @trip.nil? ? @user.photos : @trip.photos
	end
end