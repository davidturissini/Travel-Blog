require 'net/scp'
class Admin::MapsController < Admin::AdminController
	def new
		@location = current_location
		@map = @location.maps.new
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
		ActiveRecord::Base.transaction do
			if( params.has_key?(:xml) )
				xml = params.delete(:xml)
			end
			map = current_location.maps.create(params[:map])
			map.save_with_xml!(Nokogiri.parse(xml)) if xml
			render :json => map
		end
	end

	def stage
		map = current_location.maps.new
		url = map.stage_xml(Nokogiri.parse(params[:map][:xml]))
		render :json => {:url => url}
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