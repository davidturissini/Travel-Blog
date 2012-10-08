class Photo < ActiveRecord::Base
	has_and_belongs_to_many :locations
	has_one :user, :through => :locations

	def url
		"/user_images/#{user.slug}/photos/500/#{slug}.jpg"
	end

	def user
		@user || locations.first.user
	end

	def save_with_raw! raw
		_slug = Digest::SHA1.hexdigest("#{id}")
		self.slug = _slug
		filename = "#{_slug}"
		tmp_filename = "tmp/user_images/#{filename}.tmp"
		path = "#{Rails.root}/#{filename}"

		location = locations.first
		user = location.user

		File.open(tmp_filename, "w+") do |f|
		  f.write(raw)
		end

		photos_dir = user.create_subdir_if_not_exists!("photos")

		if photos_dir
			image = Magick::Image.read(tmp_filename).first
			image.format = "JPG"
			image.write("#{photos_dir}#{filename}.jpg")
			
			generate_thumbnails image

			save!
		else
			throw Exception.new
		end
	end

	private
	def generate_thumbnails raw_image
		user = locations.first.user
		thumb_sizes.each do |size|
			thumb_dir = user.create_subdir_if_not_exists!("photos/#{size}")
			thumbnail = raw_image.resize_to_fit(size, size)
			thumbnail.write("#{thumb_dir}/#{slug}.jpg")
		end
	end

	def thumb_sizes
		[50, 125, 500, 800]
	end
end