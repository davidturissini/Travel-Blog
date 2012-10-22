module TripsHelper
	def edit_trip_path loc
		edit_user_trip_path(trip.user.slug, tip.slug)
	end

	def trip_path trip
		user_trip_path(trip.user.slug, trip.slug)
	end

	def photos_edit_path trip
		trip_photos_edit_path(:trip_id => trip.slug)
	end

	def new_trip_photos_path trip
		trip_photos_new_path(:trip_id => trip.slug)
	end

	def admin_trip_path trip
		admin_trip_edit_path(trip.slug)
	end
end