class LocationsController < ApplicationController
 helper_method :current_location_type

 def index
  @user = User.find_by_slug(params[:user_id])
  @locations = @user.locations 
  respond_to do |format|
   format.html
   format.json { render :json => @locations }
  end
 end
 
 protected
 def current_location_type
  @user = User.find_by_slug(params[:user_id])
  @location_type ||= @user.location_types.find_by_slug(params[:location_type_id]) 
 end
end
