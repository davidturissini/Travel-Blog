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

	def index
		trip = current_user.trips.find_by_slug(params[:trip_id])
		render :json => trip.photos.to_json
	end

	def delete
		trip = current_user.trips.find_by_slug(params[:trip_id])
		photo = trip.photos.find_by_slug(params[:slug])
		photo.destroy
		render :json => photo
	end

	def update
		trip = current_user.trips.find_by_slug(params[:trip_id])
		photo = trip.photos.find_by_slug(params[:slug])
		photo.title = params[:title]
		photo.description = params[:description]
		photo.save!
		render :json => photo
	end

	private
	

	def save_photo raw, photo_hash = {}
		trip = current_user.trips.find_by_slug(params[:trip_id])

		ActiveRecord::Base.transaction do
			photo = trip.photos.create(photo_hash)
			photo.save_with_raw!(raw)
		end
	end

	def create_from_binary photo
		split = photo[:binary].split(",") #"data:image/jpeg;base64,
		filetype = split[0].scan(/data:image\/[a-z]\;base64/)
		decoded = Base64.decode64(split[1])

		save_photo(decoded)
		
	end

	def create_from_url photo
		url = photo.delete(:url)
		raw = open(url).read
		save_photo raw, photo
	end
end