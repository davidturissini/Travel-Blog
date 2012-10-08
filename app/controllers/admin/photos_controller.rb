require 'open-uri'

class Admin::PhotosController < Admin::AdminController
	def create
		photo = params[:photo]
		if( photo.has_key?(:binary) )
			create_from_binary(photo)
		elsif( photo.has_key?(:url) )
			create_from_url(photo)
		end
		render :json => photo
	end

	def update
		location = current_user.locations.find_by_slug(params[:location_id])
		photo = location.photos.find_by_slug(params[:slug])
		photo.title = params[:title]
		photo.description = params[:description]
		photo.save!
		render :json => photo
	end

	private
	def generate_thumbnails raw_image, ar_photo
		thumb_sizes.each do |size|
			thumb_dir = current_user.create_subdir_if_not_exists!("photos/#{size}")
			thumbnail = raw_image.resize_to_fit(size, size)
			thumbnail.write("#{thumb_dir}/#{ar_photo.slug}.jpg")
		end
	end

	def thumb_sizes
		[50, 125, 500, 800]
	end

	def save_photo raw
		location = current_user.locations.find_by_slug(params[:location_id])
		ActiveRecord::Base.transaction do
			photo = Photo.create()
			slug = Digest::SHA1.hexdigest("#{photo.id}")
			photo.slug = slug
			filename = "#{slug}"
			tmp_filename = "tmp/user_images/#{filename}.tmp"
			path = "#{Rails.root}/#{filename}"

			File.open(tmp_filename, "w+") do |f|
			  f.write(raw)
			end

			photos_dir = current_user.create_subdir_if_not_exists!("photos")

			if photos_dir
				image = Magick::Image.read(tmp_filename).first
				image.format = "JPG"
				image.write("#{photos_dir}#{filename}.jpg")
				
				generate_thumbnails image, photo

				photo.save!
				location.photos << photo
				location.save!
			else
				throw Exception.new
			end
		end
	end

	def create_from_binary photo
		split = photo[:binary].split(",") #"data:image/jpeg;base64,
		filetype = split[0].scan(/data:image\/[a-z]\;base64/)
		decoded = Base64.decode64(split[1])

		save_photo(decoded)
		
	end

	def create_from_url photo
		url = photo[:url]
		raw = open(url).read
		save_photo raw
	end
end