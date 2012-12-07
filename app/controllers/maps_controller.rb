class MapsController < ApplicationController
	def index
		@user = User.find_by_slug(params[:user_id])
		raise ActiveRecord::RecordNotFound if !@user
		
		if params.has_key?(:trip_id)
			@trip = @user.trips.find_by_slug(params[:trip_id])
			raise ActiveRecord::RecordNotFound if !@trip
			@maps = @trip.maps
			@locations = @trip.locations
		else
			@maps = @user.maps
			@locations = Location.all
		end
	end
end