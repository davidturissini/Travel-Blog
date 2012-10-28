class GoogleMapPhoto
	def initialize location
		@location = location
	end

	def url
		build_image_string
	end

	def large
		build_image_string 400, 600, 10
	end
	
	def build_image_string width = 200, height = 200, zoom = 5
 		"http://maps.google.com/staticmap?center=#{@location.latitude},#{@location.longitude}&type=sat&zoom=#{zoom}&size=#{width}x#{height}"
	end
end