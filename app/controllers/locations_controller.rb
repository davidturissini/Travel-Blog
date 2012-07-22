class LocationsController < LocationTypesController 

 def index
  @locations = current_location_type.locations 
 end

 def show
  @location = current_location_type.locations.find_by_slug(params[:id]) 
 end
 
 protected
 def current_location_type
  @user ||= User.find_by_slug(params[:user_id])
  @location_type ||= @user.location_types.find_by_slug(params[:location_type_id]) 
 end
end
