class LocationTypesController < TravellerController
 def index
  @location_types = LocationType.where({:user_id => params[:user_id]})
 end

 def show
  @location_type = LocationType.where({:user_id => params[:user_id], :id => params[:id]}).first
  respond_to do |format|
   format.html
   format.json { render :json => @location_type }
  end
 end
 
 def create
  if validate_user? 
   @location_type = LocationType.create(params[:location_type].merge({:user => current_user}))
   respond_to do |format|
    format.json { render :json => @location_type }
   end
  end
 end

 def update
  @location_type = LocationType.where({:user_id => params[:user_id], :id => params[:id]}).first
  if( @location_type.user != current_user )
   render :json => {:status=>"denied"}, :status => 401
   return
  end
  @location_type.update_attributes!(params[:location_type])
  respond_to do |format|
   format.html { render :action => :show }
   format.json { render :json => @location_type }
  end
 end
 
 def validate_user?
  if( current_user.nil? || params[:user_id].to_i != current_user.id )
   unauthorized
   return false
  end
  true
 end
end
