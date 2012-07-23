class WelcomeController < ApplicationController 
 def index
  @locations = Location.joins(:location_type, :user).all
 end
end
