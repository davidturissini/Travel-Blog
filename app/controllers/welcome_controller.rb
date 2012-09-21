class WelcomeController < ApplicationController 
 def index
 	if !current_user.anonymous?
 		user_welcome_screen
 	else
 		anonymous_welcome_screen
 	end
 end

 private
 def user_welcome_screen
 	@user = current_user
 	respond_to do |format|
 		format.html { render "users/me" }
 	end
 end

 def anonymous_welcome_screen
 	@welcome_locations = []
 	respond_to do |format|
 		format.html { render "welcome/index" }
 	end
 end
end
