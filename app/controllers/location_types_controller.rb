class LocationTypesController < TravellerController
 before_filter :current_location_type
 
 def index
  @location_types = LocationType.where({:user_id => params[:user_id]})
 end

 def update
  @location_type = LocationType.where({:user_id => params[:user_id], :id => params[:id]}).first
  @location_type.update_attributes!(params[:location_type])
  respond_to do |format|
   format.json { render :json => @location_type }
  end
 end

 def current_location_type
  @location_type ||= current_traveller.location_types.find_by_slug(params[:location_type_id])
 end
end
