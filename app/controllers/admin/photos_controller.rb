class Admin::PhotosController < Admin::AdminController
	def create
		photo = params[:photo]
		split = photo.split(",") #"data:image/jpeg;base64,
		filetype = split[0].scan(/data:image\/[a-z]\;base64/)
		decoded = Base64.decode64(split[1])
		location = current_user.locations.find_by_slug(params[:location_id])
		ActiveRecord::Base.transaction do
			photo = Photo.create()
			slug = Digest::SHA1.hexdigest("#{photo.id}")
			photo.slug = slug
			filename = "#{slug}"
			tmp_filename = "tmp/user_images/#{filename}.tmp"
			path = "#{Rails.root}/#{filename}"

			File.open(tmp_filename, "w+") do |f|
			  f.write(decoded)
			end

			photos_dir = current_user.create_subdir_if_not_exists!("photos")

			if photos_dir
				image = Magick::Image.read(tmp_filename).first
				image.format = "JPG"
				image.write("#{photos_dir}#{filename}.jpg")
				photo.save!
				location.photos << photo
				location.save!
			else
				throw Exception.new
			end
		end

		render :json => photo
	end

	def temp
		photo = params[:photo]
		index = rand(100)
		split = photo.split(",") #"data:image/jpeg;base64,
		filetype = split[0].scan(/data:image\/[a-z]\;base64/)
		decoded = Base64.decode64(split[1]) 
		filename = "#{current_user.slug}_#{index}"
		tmp_filename = "#{filename}.tmp"
		path = "#{Rails.root}/#{filename}"

		File.open(tmp_filename, "w+") do |f|
		  f.write(decoded)
		end

		image = Magick::Image.read(tmp_filename).first
		image.format = "JPG"
		thumb = image.resize_to_fit(125, 125)
		thumb.write("#{Rails.root}/public/tmp/user_images/#{filename}.jpg")

		render :json => { :id => index }
	end

	def update

	end
end