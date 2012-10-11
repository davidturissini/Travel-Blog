class Admin::LocationsController < Admin::AdminController
	def destroy
	   @location = current_location
	   @location.destroy
	   respond_to do |format|
	    format.html { redirect_to :controller => "location_types", :action => "show" }
	    format.json { render :json => @location }
	   end
	 end

	 def new
	 	@location = Location.new
	 end

	 def new_photos
	 	@location = current_location
	 end

	 def edit_photos
	 	@location = current_location
	 end

	 def edit
	 	@location = current_location
	 end

	 def update
	   @location = current_location
	   @location.update_attributes!(params[:location])  
	   respond_to do |format|
	    format.html { redirect_to request.referrer }
	    format.json { render :json => @location }
	   end
	 end

	 def create
		@location = Location.new( params[:location] )
		p_slug = params[:location][:slug]
		p_slug = params[:location][:title] if p_slug.nil?
		p_slug = @location.to_s if p_slug.nil?
		@location.slug = String.slugify( p_slug )
		@location.user = current_user
		@location.save!
		respond_to do |format| 
			format.html { redirect_to request.referrer }
			format.json { render :json => @location }
		end
	 end

	 protected
	 def current_location
	 	current_user.locations.find_by_slug(params[:location_id])
	 end
end