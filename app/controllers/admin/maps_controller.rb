require 'net/scp'
class Admin::MapsController < Admin::AdminController
	def new
		@trip = current_trip
		@map = @trip.maps.new
	end

	def index
		@trip = current_trip
		@maps = @trip.maps
	end

	def edit
		@trip = current_trip
		@map = @trip.maps.find_by_slug(params[:map_id])
	end

	def update
		@trip = current_trip
		@map = @trip.maps.find_by_slug(params[:map_id])
		@map.update_attributes!(params[:map])
		render :json => @map
	end

	def create
		ActiveRecord::Base.transaction do
			if( params.has_key?(:xml) )
				xml = params.delete(:xml)
			end
			map = current_trip.maps.create(params[:map])
			map.save_with_xml!(Nokogiri.parse(xml)) if xml
			render :json => map
		end
	end

	def stage
		map = current_trip.maps.new
		url = map.stage_xml(Nokogiri.parse(params[:map][:xml]))
		render :json => {:url => url}
	end

	def destroy
		@trip = current_trip
		@map = @trip.maps.find_by_slug(params[:map_id])
		@map.destroy
		render :json => @map
	end

	protected
	def current_trip
		current_user.trips.find_by_slug(params[:trip_id])
	end
end