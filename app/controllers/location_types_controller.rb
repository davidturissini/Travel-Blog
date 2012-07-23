class LocationTypesController < TravellerController
 def index
  @location_types = LocationType.where({:user_id => params[:user_id]})
 end

 def show
  @user = User.find_by_slug(params[:user_id])
  @location_type = @user.location_types.find_by_slug(params[:id])
  @locations = @location_type.locations
  respond_to do |format|
   format.html
   format.json { render :json => @location_type }
  end
 end
 
 def create
  if validate_user? 
   params[:location_type][:slug] = String.slugify(params[:location_type][:slug])
   @location_type = LocationType.create(params[:location_type].merge({:user => current_user}))
   respond_to do |format|
    format.html { redirect_to request.referrer }
    format.json { render :json => @location_type }
   end
  end
 end

 def destroy
  if validate_user?
   @location_type = LocationType.where({:user_id => current_user.id, :id => params[:id]}).first
   @location_type.destroy
   respond_to do |format|
    format.html { redirect_to request.referrer }
    format.json { render :json => @location_type } 
   end
  end
 end

 def update
  if( validate_user? )
   @location_type = current_user.location_types.find_by_slug(params[:id])
   @location_type.update_attributes!(params[:location_type])
   respond_to do |format|
    format.html { render :action => :show }
    format.json { render :json => @location_type }
   end
  end
 end
 
end
