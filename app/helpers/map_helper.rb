module MapHelper
	def static_map_url lat, lng, options
		width = options[:width] || 100
		height = options[:height] || 100
		zoom = options[:zoom] || 5
 		"http://maps.google.com/staticmap?center=#{lat},#{lng}&type=sat&zoom=#{zoom}&size=#{width}x#{height}"
	end

	def new_map_path trip
		new_trip_map_path(:trip_id => trip.slug)
	end

	def edit_map_path map
		edit_trip_map_path(:trip_id => map.trip.slug, :map_id => map.slug)
	end

	def maps_path trip
		trip_maps_path(:trip_id => trip.slug)
	end
end