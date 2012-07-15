class LocationTypesController < TravellerController
 before_filter :current_location_type

 def current_location_type
  @location_type ||= current_traveller.location_types.find_by_slug(params[:location_type_id])
 end
end
