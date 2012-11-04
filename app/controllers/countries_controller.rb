class CountriesController < ApplicationController
	def index
		
		respond_to do |format|
			format.html {
				@user = User.find_by_slug(params[:user_id])
				@countries = @user.trips.by_country
			}
			format.json { 
				countries = Country.all
				render :json => countries 
			}
		end
	end
end