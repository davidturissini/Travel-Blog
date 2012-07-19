class UsersController < ApplicationController
 def show
   @user = User.find(params[:id]) 
 end

 def login
  if params[:provider] == "facebook"
   login_facebook
  end
  redirect_to("/")
 end
 
 protected
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
  if( realm )
   realm.user.login!
   set_user_cookie(realm.user)
  else
   name = request.env['omniauth.auth'].info.name
   user = User.create({
    :name => name,
    :slug => String.slugify(name)
    })
   RealmAccount.create({
    :provider => "facebook",
    :provider_id => provider_id,
    :user => user
    })
    set_user_cookie(user)
  end
 end
end
