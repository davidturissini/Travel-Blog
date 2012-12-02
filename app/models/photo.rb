require 'RMagick'

class Photo < ActiveRecord::Base
	has_and_belongs_to_many :trips, :join_table => "trips_photos"
	belongs_to :user
	attr_accessible :static
	has_attached_file :static, :styles => { :thumb => "50x50>", :large => "800x800>", :square => "500x500#", :small => "200x200>" }
	include HasSlug
	include HasTitle

	def url size = :square
		static.url(size)
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

	def square size = nil
		url(:square)
	end

	def thumbnail
		url(:thumb)
	end

	def small
		url(:small)
	end

	def large
		url(:large)
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
end
