class Admin::PhotosController < Admin::AdminController
	def create
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
		image.write("#{Rails.root}/public/user_images/#{filename}.jpg")
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