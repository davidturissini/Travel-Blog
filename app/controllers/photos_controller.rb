class PhotosController < ApplicationController
	def index
		@user = User.find_by_slug(params[:user_id])
		raise ActiveRecord::RecordNotFound if !@user
		if params.has_key?(:trip_id)
			@trip = @user.trips.find_by_slug(params[:trip_id])
			raise ActiveRecord::RecordNotFound if !@trip
		end

		photo_context = @trip.nil? ? @user : @trip

		@photos = photo_context.photos.order("photos.id ASC").limit(18)

		respond_to do |format|
			format.html #
			format.json { render :json => @photos }
		end
	end
end