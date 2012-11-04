class TemplateController < ApplicationController
	def load
		method = "initialize_#{params[:path]}"
		send(method) if respond_to?(method)
		render :template => "templates/#{params[:path]}", :layout => false
	end

	protected
	def initialize_location_infowindow
		@location = Location.find(params[:trip_id])
	end
end