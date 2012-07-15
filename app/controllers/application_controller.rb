class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user
  
  def current_user
    @user ||= User.find(1)
  end

  def render_404
   render :file => "public/404.html", :status => 404, :layout => false
  end
end
