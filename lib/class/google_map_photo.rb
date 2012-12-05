class GoogleMapPhoto
	def initialize location
		@location = location
	end

	def small
		build_image_string 200, 200, 10
	end

	def url
		build_image_string
	end

	def large
		build_image_string 400, 400, 10
	end

	def square size = 200
		build_image_string size, size
	end

	def height
		nil
	end

	def thumbnail
		square 50
	end
	
	def build_image_string width = 200, height = 200, zoom = 5
 		"http://maps.google.com/staticmap?key=#{CONFIG['google_maps']['key']}&center=#{@location.latitude},#{@location.longitude}&type=sat&zoom=#{zoom}&size=#{width}x#{height}"
	end
end