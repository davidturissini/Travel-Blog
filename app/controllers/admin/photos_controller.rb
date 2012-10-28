require 'open-uri'

class Admin::PhotosController < Admin::AdminController
	def create
		photo = params[:photo]
		if( photo.has_key?(:binary) )
			save_photo(photo)
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
	

	def save_photo photo_hash
		trip = current_user.trips.find_by_slug(params[:trip_id])
		binary_file = photo_hash.delete(:binary)
		ActiveRecord::Base.transaction do
			photo = trip.photos.create(photo_hash)
			photo.set_slug!(Digest::SHA1.hexdigest(binary_file.read), trip.photos)
			photo.save_with_raw!(binary_file)
		end
	end

	def create_from_url photo_hash
		url = photo_hash.delete(:url)
		photo_hash[:binary] = open(url).read
		save_photo photo_hash
	end
end