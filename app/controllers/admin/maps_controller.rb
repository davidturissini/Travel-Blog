require 'net/scp'
class Admin::MapsController < Admin::AdminController
	def new
		@location = current_location
	end

	def index
		@location = current_location
		@maps = @location.maps
	end

	def save_tmp
		map_hash = params[:map]
		slug = Digest::SHA1.hexdigest(map_hash)
		path = "#{CONFIG['remote_static_test']['path']}#{slug}.kml"

		remote_path = "#{CONFIG['remote_static_test']['server_path']}#{path}"

		Net::SCP.start(CONFIG['remote_static_test']['domain'], CONFIG['remote_static_test']['username'], :password => CONFIG['remote_static_test']['password']) do |scp|
			scp.upload! StringIO.new(map_hash), remote_path
		end

		Net::SSH.start(CONFIG['remote_static_test']['domain'], CONFIG['remote_static_test']['username'], :password => CONFIG['remote_static_test']['password']) do |ssh|
			ssh.exec!("chmod 0644 #{remote_path}")
		end

		url = "http://#{path}"

		render :json => { :url => url }
	end

	protected
	def current_location
		current_user.locations.find_by_slug(params[:location_id])
	end
end