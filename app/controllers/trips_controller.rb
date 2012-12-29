class TripsController < ApplicationController
	def show
		@user = User.find_by_slug(params[:user_id])
		raise ActiveRecord::RecordNotFound if !@user
		@trip = @user.trips.find_by_slug(params[:id])
		raise ActiveRecord::RecordNotFound if !@trip
		@trip_photos = @trip.photos.limit(20)
		@trip_posts = @trip.posts.order("start_date ASC")
		@page_title = "#{@trip.title}"
		@og_image = @trip.picture.url
		@og_title = @trip.title
		@og_description = @trip.description

		@canonical_url = user_trip_url({
		    :user_id => @user.slug,
		    :id => @trip.slug 
		    })
	end

	def index
		trips = current_user.trips
		respond_to do |format|
			format.json { render :json => trips.to_json }
		end
	end
end
