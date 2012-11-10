class JournalsController < ApplicationController
	def show
		@user = User.find_by_slug(params[:user_id])
		@trip = @user.trips.find_by_slug(params[:trip_id])
		@journal = @trip.journals.find_by_slug(params[:id])
	end

	def index
		@user = User.find_by_slug(params[:user_id])
		@trip = @user.trips.find_by_slug(params[:trip_id])
		@journals = @trip.journals
	end
end