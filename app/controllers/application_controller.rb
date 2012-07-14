class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :navigation_content

  def navigation_content
   @nav = {
    :climbs => Climb.all
   }
  end

  def render_404
   render :file => "public/404.html", :status => 404, :layout => false
  end
end
