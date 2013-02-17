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

	def reprocess
		@user = current_user
		@photo = @user.photos.find_by_slug(params[:photo_id])
		@photo.static.reprocess!

		render :json => @photo
	end

	def new
		@user = current_user
		@trip = current_user.trips.find_by_slug(params[:trip_id])
		@location = @trip.locations.new
	end

	def index
		trip = current_user.trips.find_by_slug(params[:trip_id])
		render :json => trip.photos.to_json
	end

	def destroy
		photo = current_user.photos.find_by_slug(params[:id])
		photo.destroy
		render :json => photo
	end

	def update
		photo = current_user.photos.find_by_slug(params[:slug])
		photo.title = params[:title]
		photo.description = params[:description]
		photo.save!
		render :json => photo
	end

	private
	

	def save_photo photo_hash
		trip = current_user.trips.find_by_slug(params[:trip_id])
		binary_file = photo_hash.delete(:binary)
		binary_file = binary_file.tempfile if !binary_file.is_a?(Tempfile)
		ActiveRecord::Base.transaction do
			photo = trip.photos.create(photo_hash)
			photo.user_id = current_user.id
			photo.set_slug!(Digest::SHA1.hexdigest(binary_file.read), current_user.photos)
			photo.static = binary_file
			photo.save!
		end
	end

	def create_from_url photo_hash
		url = photo_hash.delete(:url)
		photo_hash[:binary] = open(url)
		save_photo photo_hash
	end
end