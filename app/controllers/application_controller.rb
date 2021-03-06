class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user, :locations_nav
  rescue_from ActiveRecord::RecordNotFound, :with => :not_found

  def not_found
    render :template => "global/four_oh_four", :status => 404
  end

  def current_user
   if cookies[:user] && cookies[:user] != ""
    cookie = JSON.parse( cookies[:user] )
    user = User.where({:id => cookie["id"], :token => cookie["token"]}).first if !cookie["token"].nil?
   end
   user || User.anonymous
  end

  def render_404
   render :file => "public/404.html", :status => 404, :layout => false
  end

  def unauthorized
   redirect_to("/")
  end

  def locations_nav
   Location.most_recent_published
  end

 def redirect_to_user_welcome
  redirect_to(welcome_user_path)
 end
 
 def set_user_cookie user
   cookie_hash = {
    :id => user.id,
    :token => user.token,
    :name => user.name,
    :photo_url => user.photo_url,
    :slug => user.slug,
    :latitude => user.latitude,
    :longitude => user.longitude,
    :city => user.city
   }.to_json
   
   cookies[:user] = cookie_hash
 end

 def validate_user?
  user = User.find_by_slug(params[:user_id])
  if( current_user.anonymous? || user.token != current_user.token )
   unauthorized
   return false
  end
  true
 end

end
