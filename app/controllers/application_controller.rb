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

  def unauthorized
   redirect_to("/")
  end

 def validate_user?
  user = User.find_by_slug(params[:user_id])
  if( current_user.nil? || user.token != current_user.token )
   unauthorized
   return false
  end
  true
 end

end
