module MapHelper
	def static_map_url lat, lng, options
		width = options[:width] || 100
		height = options[:height] || 100
		zoom = options[:zoom] || 5
 		"http://maps.google.com/staticmap?center=#{lat},#{lng}&type=sat&zoom=#{zoom}&size=#{width}x#{height}"
	end

	def new_map_path location
		new_location_map_path(:location_id => location.slug)
	end

	def edit_map_path map
		edit_location_map_path(:location_id => map.location.slug, :map_id => map.slug)
	end

	def maps_path location
		location_maps_path(:location_id => location.slug)
	end
end