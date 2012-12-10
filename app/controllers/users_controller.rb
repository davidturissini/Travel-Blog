require 'digest/md5'

class UsersController < ApplicationController

	def validate_slug
		slug = String.slugify(params[:slug])
		unique = HasSlug.get_unique_slug(slug, User.where("id > 0"))
		render :json => { :slug => unique }
	end

	def show
		@user = User.find_by_slug(params[:user_id]) 
		raise ActiveRecord::RecordNotFound if !@user
		@user_trips = @user.trips.by_year
		respond_to do |format|
			format.html { render "users/show" }
		end
	end

	def logout
		current_user.logout!
		cookies[:user] = {}
		respond_to do |format|
			format.html { redirect_to("/") }
		end
	end

	def login
		redirect_url = nil
		if params.has_key?(:redirect)
			redirect_url = params[:redirect]
		elsif params.has_key?(:state) && String.is_url?(params[:state])
			redirect_url = params[:state]
		end

		ActiveRecord::Base.transaction do
			provider_id = request.env['omniauth.auth'].uid

			realm = RealmAccount.find_or_create_by_provider_and_provider_id(params[:provider], provider_id)
			realm.login_user!(request.env['omniauth.auth'])
			set_user_cookie(realm.user)
			
			if current_user.incomplete?
				redirect_to_user_welcome
			elsif !redirect_url.nil?
				redirect_to(redirect_url)
			else
				redirect_to("/")
			end
		end
	end

	protected

	def login_flickr
		provider_id = request.env['omniauth.auth'].uid
		realm = RealmAccount.where({:provider => "flickr", :provider_id => provider_id}).first
		token = request.env['omniauth.auth'].credentials["token"]
		secret = request.env['omniauth.auth'].credentials["secret"]
		if !current_user.anonymous? && !realm
			RealmAccount.create({
				:provider => "flickr",
				:provider_id => provider_id,
				:access_token => token,
				:user => current_user,
				:shared_secret => secret
			})
		elsif realm
			realm.shared_secret = secret
			realm.access_token = token
			realm.save!
		end
	end
end
