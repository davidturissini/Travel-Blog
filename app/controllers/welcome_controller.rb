class WelcomeController < ApplicationController 
 def index
 	if !current_user.anonymous? && !current_user.incomplete?
 		user_home
 	elsif current_user.incomplete?
 		redirect_to welcome_user_path
 	else
 		anonymous_welcome_screen
 	end
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
 	respond_to do |format|
 		format.html { render "admin/users/me" }
 	end
 end

 def anonymous_welcome_screen
 	@welcome_locations = Location.random(5)
 	respond_to do |format|
 		format.html { render "welcome/index" }
 	end
 end
end
