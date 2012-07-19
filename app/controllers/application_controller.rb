class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user

  def current_user
   if cookies[:user]
    cookie = JSON.parse( cookies[:user] )
    user = User.where({:id => cookie["id"], :token => cookie["token"]}).first
   end
   user || nil
  end

  def render_404
   render :file => "public/404.html", :status => 404, :layout => false
  end

end
