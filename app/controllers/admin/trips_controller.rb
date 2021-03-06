class Admin::TripsController < Admin::AdminController

	def merge
		@user = current_user
		@trip = current_user.trips.find_by_slug(params[:trip_id])
		merge_trip = current_user.trips.find_by_slug(params[:merge_trip_id])

		ActiveRecord::Base.transaction do
			@trip.merge!(merge_trip)
			merge_trip.destroy
		end

		respond_to do |format|
			format.html { redirect_to("/#{@user.slug}/#{@trip.slug}") }
			format.json { render :json => @trip }
		end
	end

	def new
		@user = current_user
		@trip = current_user.trips.new
	end

	def destroy
		@trip = current_trip
		@trip.destroy
		render :json => @trip
	end

	def edit_locations
		@user = current_user
		@trip = current_trip
		@locations = @trip.locations
	end

	def edit
		@user = current_user
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

		params[:trip][:title] = Sanitize.clean(params[:trip][:title])

		if params[:trip].has_key?(:summary) && !params[:trip][:summary].nil?
			params[:trip][:summary] = Sanitize.clean(params[:trip][:summary].strip)
		end 

		@trip.update_attributes!(params[:trip])
		@trip.save!

		respond_to do |format|
			format.html { redirect_to user_trip_path(:user_id => current_user.slug, :trip_id => @trip.slug) }
			format.json { render :json => @trip }
		end
	end

	 def new_photos
	 	@user = current_user
	 	@trip = current_trip
	 end

	 def edit_photos
	 	@user = current_user
	 	@trip = @user.trips.find_by_slug(params[:id])
	 end

	protected
	def current_trip
		current_user.trips.find_by_slug(params[:id])
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