class Admin::TripsController < Admin::AdminController
	def new
		@trip = current_user.trips.new
	end

	def destroy
		@trip = current_trip
		@trip.destroy
		render :json => @trip
	end

	def edit_locations
		@trip = current_trip
		@locations = @trip.locations
	end

	def edit
		@trip = current_user.trips.includes(:maps, :locations, :photos).find_by_slug(params[:trip_id])
		render404 if !@trip
		@trip_photos = @trip.photos
	end

	def create
		ActiveRecord::Base.transaction do
			trip_hash = params[:trip]
			trip = current_user.trips.create(params[:trip])
			trip.set_slug!(String.slugify(trip_hash['title']), current_user.trips)
			trip.save!
			if( params.has_key?(:locations) )
				save_trip_locations trip, params[:locations]
			end

			render :json => trip
		end
	end

	def update
		@trip = current_trip
		params[:trip].delete(:user_id)
		params[:trip].delete(:slug)

		@trip.update_attributes!(params[:trip])
		@trip.save!

		respond_to do |format|
			format.html { redirect_to request.referrer }
			format.json { render :json => @trip }
		end
	end

	 def new_photos
	 	@trip = current_trip
	 end

	 def edit_photos
	 	@trip = current_trip
	 end

	protected
	def current_trip
		current_user.trips.find_by_slug(params[:trip_id])
	end

	def save_trip_locations trip, locations_hash
		locations_hash.each do |loc_hash|
			if( loc_hash.has_key?(:id) && trip.locations.find(loc_hash[:id]) )
				location = trip.locations.find(loc_hash[:id])
				if( location )
					location.update_attributes(loc_hash)
					location.save!
				end
			else
				if( !loc_hash.has_key?(:slug) )
					loc_hash[:slug] = Digest::SHA1.hexdigest("#{loc_hash['latitude']}#{loc_hash['longitude']}")
				end
				trip.locations.create!(loc_hash)
			end
		end
	end

	def render404
		raise ActiveRecord::RecordNotFound
	end
end