require 'net/scp'
class Admin::MapsController < Admin::AdminController
	def new
		@location = current_location
	end

	def index
		@location = current_location
		@maps = @location.maps
	end

	def edit
		@location = current_location
		@map = @location.maps.find_by_slug(params[:map_id])
	end

	def update
		@location = current_location
		@map = @location.maps.find_by_slug(params[:map_id])
		@map.update_attributes!(params[:map])
		render :json => @map
	end

	def create
		map = current_location.maps.new
		ActiveRecord::Base.transaction do
			map.save_with_xml!(Nokogiri.parse(params[:map][:xml]))
		end
		render :json => map
	end

	def destroy
		@location = current_location
		@map = @location.maps.find_by_slug(params[:map_id])
		@map.destroy
		render :json => @map
	end

	protected
	def current_location
		current_user.locations.find_by_slug(params[:location_id])
	end
end