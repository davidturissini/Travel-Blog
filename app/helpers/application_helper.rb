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
 	partial_path = "#{params[:controller]}/"
 	full_path = "#{Rails.root}/app/views/#{partial_path}_#{filename}.html.erb"
 	if( File.exists?(full_path) )
 		render(:partial => "#{partial_path}#{filename}")
 	end
 end

 def welcome_screen?
 	params[:controller] == "welcome" && (current_user.anonymous? || current_user.incomplete?)
 end

 def flickr_photoset_url set_params
 	"http://farm#{set_params["farm"]}.staticflickr.com/#{set_params["server"]}/#{set_params['primary']}_#{set_params['secret']}_q.jpg"
 end

 def config_json
 	json_hash = {}
 	json_hash['static'] = CONFIG['static'].clone
 	json_hash['static'].delete("username")
 	json_hash['static'].delete("password")
 	json_hash['s3'] = CONFIG['s3'].clone
 	json_hash['s3'].delete("access_key_id")
 	json_hash['s3'].delete("secret_access_key")
 	json_hash.to_json
 end
end
