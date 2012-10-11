class LocationsController < ApplicationController
 helper_method :current_location_type

 def index
  @locations = current_location_type.locations 
  respond_to do |format|
   format.html
   format.json { render :json => @locations }
  end
 end

 def show
  user = User.find_by_slug(params[:user_id])
  @location = user.locations.find_by_slug(params[:id])
  @page_title = "#{@location.title}"
  @og_image = @location.picture.url
  @og_title = @location.title

  @canonical_url = user_location_url({
    :user_id => @location.user.slug,
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
