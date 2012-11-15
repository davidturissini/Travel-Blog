require 'RMagick'

class Photo < ActiveRecord::Base
	has_and_belongs_to_many :trips, :join_table => "trips_photos"
	belongs_to :user
	include HasSlug
	include HasTitle

	def url size = 500, folder = nil
		folder = folder || "#{size}"
		"http://#{CONFIG['static']['domain']}#{static_photo_path}#{folder}/#{slug}.jpg"
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

	def square size = 200
		url size, "#{size}_#{size}"
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

	def save_with_raw! raw_file
		filename = slug
		tmp_filename = "tmp/user_images/#{filename}.tmp"
		path = "#{Rails.root}/#{filename}"

		trip = trips.limit(1).first
		user = trip.user

		photos_dir = user.create_content_dir!("photos/originals/")

		image = Magick::Image.read(raw_file.path).first
		user.save_photo! StringIO.open(image.to_blob), "originals/#{filename}.jpg"
		
		generate_thumbnails image

		self.width = image.columns
		self.height = image.rows
		self.save!
	end

	private
	def generate_thumbnails raw_image
		user = trips.limit(1).first.user
		thumb_sizes.each do |size|
			thumb_dir = user.create_content_dir!("photos/#{size}")
			thumbnail = raw_image.resize_to_fit(size, size)
			user.save_photo! StringIO.open(thumbnail.to_blob), "#{size}/#{slug}.jpg"
		end

		thumb_squares.each do |size|
			thumb_dir = user.create_content_dir!("photos/#{size}_#{size}")
			thumbnail = raw_image.crop_resized(size, size)
			user.save_photo! StringIO.open(thumbnail.to_blob), "#{size}_#{size}/#{slug}.jpg"
		end
	end

	def thumb_squares
		[200, 400, 600]
	end

	def thumb_sizes
		[50, 125, 500, 800]
	end
end
