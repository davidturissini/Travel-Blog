class Photo < ActiveRecord::Base
	has_and_belongs_to_many :locations
	has_one :user, :through => :locations

	def url size = 500
		"/user_images/#{user.slug}/photos/#{size}/#{slug}.jpg"
	end

	def user
		@user || locations.first.user
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
		url(150)
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

		photos_dir = user.create_subdir_if_not_exists!("photos")
		originals_dir = user.create_subdir_if_not_exists!("photos/originals")

		if photos_dir
			image = Magick::Image.from_blob(raw).first
			image.write("#{originals_dir}#{filename}.jpg")
			
			generate_thumbnails image

			width = image.columns
			height = image.rows
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