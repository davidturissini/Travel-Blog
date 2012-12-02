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
		@map = @trip.maps.find_by_slug(params[:id])
		@map.update_attributes!(params[:map])
		render :json => @map
	end

	def create
		ActiveRecord::Base.transaction do
			map_hash = params[:map].clone
			if( map_hash.has_key?(:xml) )
				xml = map_hash.delete(:xml)
				doc = Nokogiri.parse(xml.tempfile.read)
				coords_elem = doc.css("coordinates")[0]
				coords = coords_elem.inner_html.split(" ")[0].gsub("\n", "")
				lat_lng = coords.split(",")
				map_hash[:start_lat] = lat_lng[1].to_f 
				map_hash[:start_lng] = lat_lng[0].to_f
			end
			map = current_trip.maps.create(map_hash)
			map.start_lat = map_hash[:start_lat]
			map.start_lng = map_hash[:start_lng]
			map.save_with_xml!(doc) if doc
			render :json => map
		end
	end

	def destroy
		@trip = current_trip
		@map = @trip.maps.find_by_slug(params[:id])
		@map.destroy
		render :json => @map
	end

	protected
	def current_trip
		current_user.trips.find_by_slug(params[:trip_id])
	end
end