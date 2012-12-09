class TripsController < ApplicationController
	def show
		@user = User.find_by_slug(params[:user_id])
		raise ActiveRecord::RecordNotFound if !@user
		@trip = @user.trips.find_by_slug(params[:id])
		raise ActiveRecord::RecordNotFound if !@trip
		@photos = @trip.photos.limit(10)
		@page_title = "#{@trip.title}"
		@og_image = @trip.picture.url
		@og_title = @trip.title
		@og_type = "trip"

		@canonical_url = user_trip_url({
		    :user_id => @user.slug,
		    :id => @trip.slug 
		    })
	end
end
