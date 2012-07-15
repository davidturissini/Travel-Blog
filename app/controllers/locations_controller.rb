class LocationsController < LocationTypesController 
 def index
  @locations = current_location_type.locations 
 end
 def show
  @location = current_location_type.locations.find_by_slug(params[:id]) 
 end
end
