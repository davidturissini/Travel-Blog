class LocationsController < ApplicationController
 helper_method :current_location_type
  
 def destroy
  if validate_user?
   @location_type = current_user.location_types.find_by_slug(params[:location_type_id])
   @location = @location_type.locations.find_by_slug(params[:id])
   @location.destroy
   respond_to do |format|
    format.html { redirect_to :controller => "location_types", :action => "show" }
    format.json { render :json => @location }
   end
  end
 end

 def new
  if validate_user?
   @location = Location.new({
    :location_type => current_location_type
   })
  end
 end

 def edit
  if validate_user?
   @location_type = current_user.location_types.find_by_slug(params[:location_type_id])
   @location = @location_type.locations.find_by_slug(params[:id])
   
  end
 end

 def update
  if validate_user?
   @location = current_location_type.locations.find_by_slug(params[:id])
   @location.update_attributes!(params[:location])  
   respond_to do |format|
    format.html { redirect_to request.referrer }
    format.json { render :json => @location }
   end
  end
 end

 def create
  if validate_user?
   p_slug = params[:location][:slug]
   p_slug = params[:location][:title] if p_slug.nil?
   params[:location][:slug] = String.slugify( p_slug )
   @location = Location.create!(params[:location].merge({:location_type => current_location_type}))
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
  @page_title = "#{@location.description} - #{@location.title}"
  @og_image = @location.photo_url
  @og_title = @location.title
  @canonical_url = user_location_type_location_url({
    :user_id => @location.user.slug, 
    :location_type_id => current_location_type.slug, 
    :id => @location.slug 
    })
  raise ActiveRecord::RecordNotFound if !@location 
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
