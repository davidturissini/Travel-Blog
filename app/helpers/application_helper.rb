module ApplicationHelper
 def image source, options = {}
  source = source.nil? ? "melissa_and_me.jpg" : source
  image_tag source, options
 end

 def social_providers
 	YAML::load(File.open("#{Rails.root}/config/omniauth_config.yml"))
 end

 def photo_filename url
 	split = url.split("/")
 	split[split.length - 1]
 end

 def render_admin_ribbon
 	filename = "admin_ribbon"
 	partial_path = "admin/#{params[:controller]}/"
 	full_path = "#{Rails.root}/app/views/#{partial_path}_#{filename}.html.erb"
 	if( File.exists?(full_path) )
 		render(:partial => "#{partial_path}#{filename}")
 	end
 end

 def flickr_photoset_url set_params
 	"http://farm#{set_params["farm"]}.staticflickr.com/#{set_params["server"]}/#{set_params['primary']}_#{set_params['secret']}_q.jpg"
 end
end
