class PhotosController < ApplicationController
	def index
		@user = User.find_by_slug(params[:user_id])
		raise ActiveRecord::RecordNotFound if !@user
		if params.has_key?(:trip_id)
			@trip = @user.trips.find_by_slug(params[:trip_id])
			raise ActiveRecord::RecordNotFound if !@trip
		end

		photos = @trip.nil? ? @user.photos : @trip.photos

		@photos = photos.order("photos.id ASC").limit(18)
	end
end