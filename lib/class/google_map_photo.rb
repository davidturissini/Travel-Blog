class GoogleMapPhoto
	def initialize location
		@location = location
	end

	def small
		build_image_string 100, 100, 10
	end

	def url size = nil
		build_image_string
	end

	def large
		build_image_string 800, 450, 10
	end

	def square size = 200
		build_image_string size, size
	end

	def original
		build_image_string 1200, 1200
	end

	def widescreen
		build_image_string 1200, 675
	end
	
	def build_image_string width = 800, height = 450, zoom = 5
 		"http://maps.google.com/staticmap?key=#{CONFIG['google_maps']['key']}&center=#{@location.latitude},#{@location.longitude}&type=sat&zoom=#{zoom}&size=#{width}x#{height}"
	end
end