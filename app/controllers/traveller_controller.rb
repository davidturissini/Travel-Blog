class TravellerController < ApplicationController
 before_filter :current_traveller

 def current_traveller
   @traveller = User.find(params[:user_id])
 end
end
