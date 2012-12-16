class MapsController < ApplicationController
	def index
		@user = User.find_by_slug(params[:user_id])
		raise ActiveRecord::RecordNotFound if !@user
		@maps = @user.maps
		@locations = @user.locations
	end
end