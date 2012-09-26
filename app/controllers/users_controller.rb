require 'digest/md5'

class UsersController < ApplicationController
 def show
  @user = User.find_by_slug(params[:user_id]) 
  @user_locations = Location.most_recent_published.where("location_types.user_id" => @user.id)
  render_show
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
  else
    redirect_to("/")
  end
 end
 
 protected
 def redirect_to_user_welcome
  redirect_to(welcome_user_path)
 end

 def render_show
  respond_to do |format|
   format.html { render "users/show" }
  end
 end

 def set_user_cookie user
   cookies[:user] = {
    :id => user.id,
    :token => user.token,
    :name => user.name,
    :photo_url => user.photo_url,
    :slug => user.slug
   }.to_json
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
