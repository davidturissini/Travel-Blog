class Admin::TripsController < Admin::AdminController
	def new

	end

	def edit
		@trip = current_user.trips.find_by_slug(params[:trip_id])

	end

	def create
		ActiveRecord::Base.transaction do
			trip_hash = params[:trip]
			trip_hash[:slug] = String.slugify(trip_hash['title'])
			trip = current_user.trips.create(params[:trip])
			if( params.has_key?(:locations) )
				save_trip_locations trip, params[:locations]
			end

			render :json => trip
		end
	end

	protected
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
end