class LocationsController < LocationTypesController 
 helper_method :current_location_type

 def create

 end

 def index
  @locations = current_location_type.locations 
  respond_to do |format|
   format.html
   format.json { render :json => @locations }
  end
 end

 def show
  @location = current_location_type.locations.find_by_slug(params[:id]) 
  respond_to do |format|
   format.html
   format.json { render :json => @locations }
  end
 end
 
 protected
 def current_location_type
  @user ||= User.find_by_slug(params[:user_id])
  @location_type ||= @user.location_types.find_by_slug(params[:location_type_id]) 
 end
end
