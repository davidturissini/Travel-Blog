class MapsController < ApplicationController
	def index
		@user = User.find_by_slug(params[:user_id])
		@maps = @user.maps
	end
end