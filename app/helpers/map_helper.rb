module MapHelper
	def static_map_url lat, lng, options
		width = options[:width] || 100
		height = options[:height] || 100
		zoom = options[:zoom] || 5
 		"http://maps.google.com/staticmap?center=#{lat},#{lng}&type=sat&zoom=#{zoom}&size=#{width}x#{height}"
	end
end