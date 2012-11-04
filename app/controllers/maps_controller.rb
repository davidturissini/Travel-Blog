class MapsController < ApplicationController
	def index
		user = User.find_by_slug(params[:user_id])
		@trip = user.trips.find_by_slug(params[:trip_id])
		@maps = @trip.maps
	end
end