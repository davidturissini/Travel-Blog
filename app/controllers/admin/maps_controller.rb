require 'net/scp'
class Admin::MapsController < Admin::AdminController
	def new
		@user = current_user
		@trip = current_trip
		@map = @trip.maps.new
	end

	def index
		@user = current_user
		@trip = current_trip
		@maps = @trip.maps
	end

	def edit
		@trip = current_trip
		@map = @trip.maps.find_by_slug(params[:map_id])
	end

	def update
		@trip = current_trip
		params[:map].delete(:slug)
		params[:map].delete(:user_id)
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
		url = current_user.stage_map!(Nokogiri.parse(params[:map][:xml].tempfile.read))
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