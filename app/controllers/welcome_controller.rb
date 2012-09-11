class WelcomeController < ApplicationController 
 def index
  @hero_locations = Location.with_recent_entries(5)
 end
end
