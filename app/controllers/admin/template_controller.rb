class Admin::TemplateController < Admin::AdminController
	def load
		method = "initialize_#{params[:path]}"
		send(method)
		render :template => "admin/templates/#{params[:path]}", :layout => false
	end

	private
	def initialize_location_map
		@location = current_user.locations.find_by_slug(params[:location_id])
	end
end