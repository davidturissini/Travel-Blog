class Admin::LocationsController < Admin::AdminController
	def destroy
	   @location_type = current_user.location_types.find_by_slug(params[:location_type_id])
	   @location = @location_type.locations.find_by_slug(params[:id])
	   @location.destroy
	   respond_to do |format|
	    format.html { redirect_to :controller => "location_types", :action => "show" }
	    format.json { render :json => @location }
	   end
	 end

	 def new
	   @location = Location.new({
	    :location_type => current_location_type
	   })
	 end

	 def edit
	   @location_type = current_user.location_types.find_by_slug(params[:location_type_id])
	   @location = @location_type.locations.find_by_slug(params[:id])
	 end

	 def update
	   @location = current_location_type.locations.find_by_slug(params[:id])
	   @location.update_attributes!(params[:location])  
	   respond_to do |format|
	    format.html { redirect_to request.referrer }
	    format.json { render :json => @location }
	   end
	 end

	 def create
	 	user = User.find_by_slug(params[:user_id])
	   p_slug = params[:location][:slug]
	   p_slug = params[:location][:title] if p_slug.nil?
	   params[:location][:slug] = String.slugify( p_slug )
	   params[:location][:user_id] = user.id
	   @location = Location.create!( params[:location] )
	   respond_to do |format| 
	    format.html { redirect_to request.referrer }
	    format.json { render :json => @location }
	   end
	 end
end