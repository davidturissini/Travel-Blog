class TemplateController < ApplicationController
	def load
		render :template => "templates/#{params[:path]}", :layout => false
	end
end