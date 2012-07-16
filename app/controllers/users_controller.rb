class UsersController < ApplicationController
 def login
  if params[:provider] == "facebook"
   login_facebook
  end
 end
 
 protected
 def login_facebook
   
 end
end
