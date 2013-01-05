module PhotoHelper

	def photo_index_infinite_path
		if @trip
			"/template/photo_grid?user_id=#{@trip.user.slug}&amp;trip_id=#{@trip.slug}"
		else
			"/template/photo_grid?user_id=#{@user.slug}"
		end
	end

end