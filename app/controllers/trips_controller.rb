class TripsController < ApplicationController
	def show
		@user = current_user
		@trip = @user.trips.find_by_slug(params[:id])
	end
end
