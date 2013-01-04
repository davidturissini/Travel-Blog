class WelcomeController < ApplicationController 
	def index
		user = User.find_by_slug("dave-and-melissa")
		@hero_tiles = user.trips.order("start_date DESC").limit(3)
	end

	def user
		@user = current_user
		if current_user.anonymous? || !current_user.incomplete?
			redirect_to("/")
		end
	end

	private
	def user_home
		@user = current_user
		redirect_to user_path(:id => @user.slug)
	end

	def anonymous_welcome_screen
		@welcome_trips = Trip.random(5)
		respond_to do |format|
			format.html { render "welcome/index" }
		end
	end
end