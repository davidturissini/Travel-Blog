class PhotosController < ApplicationController
	def index
		@user = User.find_by_slug(params[:user_id])
		if params.has_key?(:trip_id)
			@trip = @user.trips.find_by_slug(params[:trip_id])
		end

		@photos = @trip.nil? ? @user.photos : @trip.photos.order("photos.id ASC")
	end
end