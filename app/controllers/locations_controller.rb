class LocationsController < ApplicationController
 helper_method :current_location_type

 def edit
  if validate_user?
   @location_type = current_user.location_types.find_by_slug(params[:location_type_id])
   @location = @location_type.locations.find_by_slug(params[:id])
   
  end
 end

 def update
  if validate_user?
   @location_type = current_user.location_types.find_by_slug(params[:location_type_id])
   @location = @location_type.locations.find_by_slug(params[:id])
   @location.update_attributes!(params[:location])  
   respond_to do |format|
    format.html { redirect_to request.referrer }
    format.json { render :json => @location }
   end
  end
 end

 def create
  if validate_user?
   @location_type = current_user.location_types.find_by_slug(params[:location_type_id])
   params[:location][:slug] = String.slugify( params[:location][:slug] )
   @location = Location.create!(params[:location].merge({:location_type => @location_type}))
   respond_to do |format| 
    format.html { redirect_to request.referrer }
    format.json { render :json => @location }
   end  
  end
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
  @user = User.find_by_slug(params[:user_id])
  @location_type ||= @user.location_types.find_by_slug(params[:location_type_id]) 
 end
end
