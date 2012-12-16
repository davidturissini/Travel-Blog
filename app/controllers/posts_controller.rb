class PostsController < ApplicationController
	def show
		@user = User.find_by_slug(params[:user_id])
		raise ActiveRecord::RecordNotFound if !@user
		@post = @user.posts.find_by_slug(params[:id])
		raise ActiveRecord::RecordNotFound if !@post
	end

	def index
		@user = User.find_by_slug(params[:user_id])
		raise ActiveRecord::RecordNotFound if !@user
		@trip = @user.trips.find_by_slug(params[:trip_id])
		raise ActiveRecord::RecordNotFound if !@trip
		@journals = @trip.journals
	end
end