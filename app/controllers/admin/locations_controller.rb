class Admin::LocationsController < Admin::AdminController
	def destroy
	   @location = current_location
	   @location.destroy
	   render :json => @location
	 end

	 def new
	 	@trip = current_trip
	 	@location = @trip.locations.new
	 end

	 def index
	 	@trip = current_user.trips.find_by_slug(params[:trip_id])
	 	@locations = @trip.locations
	 end

	 def edit
	 	@trip = current_user.trips.joins(:locations).find_by_slug(params[:trip_id])
	 	@location = @trip.locations.find_by_slug(params[:location_id])
	 end

	 def update
	 	location = current_location
	 	location.update_attributes!(params[:location])
	 	location.save!
	 	render :json => location
	 end

	 def create
		@location = current_trip.locations.new( params[:location] )
		@location.set_slug!(String.slugify( @location.smart_title ), current_trip.locations)
		@location.save!
		respond_to do |format| 
			format.html { redirect_to request.referrer }
			format.json { render :json => @location }
		end
	 end

	 protected
	 def current_trip
	 	current_user.trips.find_by_slug(params[:trip_id])
	 end
	 def current_location
	 	current_trip.locations.find_by_slug(params[:location_id])
	 end
end