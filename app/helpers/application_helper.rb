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
end
