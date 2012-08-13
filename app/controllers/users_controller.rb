class UsersController < ApplicationController
 def show
  @user = User.find_by_slug(params[:user_id]) 
  render_show
 end

 def me
  params[:user_id] = current_user.slug
  if validate_user?
   @user = current_user
    respond_to do |format|
     format.html { render "users/me" }
    end
  end
 end
  
 def update
  params[:user_id] = current_user.slug
  if validate_user?
    [:id, :token, :salt].each do |prop|
      params[:user].delete(prop)
    end
    current_user.update_attributes!(params[:user])
    respond_to do |format|
      format.html { redirect_to :action => :me }
      format.json { render :json => current_user }
    end
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
  if params[:provider] == "facebook"
   login_facebook
  end
  redirect_to("/")
 end
 
 protected
 def render_show
  respond_to do |format|
   format.html { render "users/show" }
  end
 end

 def set_user_cookie user
   cookies[:user] = {
    :id => user.id,
    :token => user.token,
    :name => user.name
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
   name = request.env['omniauth.auth'].info.name
   user = User.new_traveller({:name => name})
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
