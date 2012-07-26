class WelcomeController < ApplicationController 
 def index
  @hero_locations = Location.joins(:location_type, :user).all
  @recent_locations = Location.with_recent_entries
 end
end
