class Admin::TemplateController < Admin::AdminController
	def load
		render :template => "admin/templates/#{params[:path]}", :layout => false
	end
end