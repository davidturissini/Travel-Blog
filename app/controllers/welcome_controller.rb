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
 	@welcome_locations = []
 end

 def anonymous_welcome_screen
 	@welcome_locations = []
 end
end
