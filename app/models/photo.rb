class Photo < ActiveRecord::Base
	has_and_belongs_to_many :trips, :join_table => "trips_photos"

	def url size = 500
		"http://#{CONFIG['static']['domain']}#{static_photo_path}#{size}/#{slug}.jpg"
	end

	def static_photo_path
		"/#{CONFIG['static']['user_path']}#{user.slug}/photos/"
	end

	def user
		@user || trips.first.user
	end

	def proportion
		width.to_f / height.to_f
	end

	def proportional_height width
		height * (1/proportion)
	end

	def thumbnail
		url(50)
	end

	def small
		url(125)
	end

	def large
		url(800)
	end

	def save_with_raw! raw
		_slug = Digest::SHA1.hexdigest("#{id}")
		self.slug = _slug
		filename = "#{_slug}"
		tmp_filename = "tmp/user_images/#{filename}.tmp"
		path = "#{Rails.root}/#{filename}"

		location = locations.first
		user = location.user

		photos_dir = user.create_content_dir!("photos/originals/")

		image = Magick::Image.from_blob(raw).first
		user.save_photo! StringIO.open(image.to_blob), "originals/#{filename}.jpg"
		
		generate_thumbnails image

		self.width = image.columns
		self.height = image.rows
		self.save!
	end

	private
	def generate_thumbnails raw_image
		user = locations.first.user
		thumb_sizes.each do |size|
			thumb_dir = user.create_content_dir!("photos/#{size}")
			thumbnail = raw_image.resize_to_fit(size, size)
			user.save_photo! StringIO.open(thumbnail.to_blob), "#{size}/#{slug}.jpg"
		end
	end

	def thumb_sizes
		[50, 125, 500, 800]
	end
end