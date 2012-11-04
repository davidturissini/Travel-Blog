class TripsController < ApplicationController
	def show
		@user = current_user
		@trip = @user.trips.find_by_slug(params[:id])
		@page_title = "#{@trip.title}"
		@og_image = @trip.picture.url
		@og_title = @trip.title

		@canonical_url = user_location_url({
		    :user_id => @user.slug,
		    :id => @trip.slug 
		    })
		raise ActiveRecord::RecordNotFound if !@trip 
	end
end
