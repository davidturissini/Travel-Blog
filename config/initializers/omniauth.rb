Rails.application.config.middleware.use OmniAuth::Builder do
 config = YAML::load(File.open("#{Rails.root}/config/omniauth_config.yml"))
 config.each_pair do |provider, hash|
  provider provider, hash["app_id"], hash["secret"]
 end
end
