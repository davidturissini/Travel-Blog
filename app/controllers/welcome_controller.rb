class WelcomeController < ApplicationController 
 def index
  @recent_locations = Location.with_recent_entries(5)
 end
end
