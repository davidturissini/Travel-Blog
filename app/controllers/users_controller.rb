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
		send("login_#{params[:provider]}")

		if current_user.incomplete?
			redirect_to_user_welcome
		elsif !params[:redirect].nil?
			redirect_to(params[:redirect])
		else
			redirect_to("/")
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

	def login_facebook
		provider_id = request.env['omniauth.auth'].uid
		realm = RealmAccount.where({:provider => "facebook", :provider_id => provider_id}).first
		token = request.env['omniauth.auth'].credentials["token"]
		if( realm )
			realm.access_token = token
			realm.save!
			realm.user.login!
			set_user_cookie(realm.user)
		else
			name = request.env['omniauth.auth'].info.first_name
			username = request.env['omniauth.auth'].info.nickname
			user = User.new_traveller({
				:name => name, 
				:photo_url => "https://graph.facebook.com/#{username}/picture"
				})
			RealmAccount.create({
				:provider => "facebook",
				:provider_id => provider_id,
				:user => user
				})
			user.login!
			set_user_cookie(user)
		end
	end
end
