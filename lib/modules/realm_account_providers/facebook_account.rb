module FacebookAccount
	def distribute_trip trip
		graph = Koala::Facebook::API.new(access_token)
	    graph.put_connections(provider_id, "#{CONFIG['facebook']['namespace']}:visit", :trip => "http://samples.ogp.me/381205205302022")
	end

	def permission? action
		!realm_permissions.find_by_permission(action.to_s).nil?
	end

	def capture_permissions!
		permissions = fetch_permissions
		self.realm_permissions.clear
		permissions.each_pair do |permission, value|
			self.realm_permissions.create({
				:permission => permission
				})
		end
	end

	def fetch_permissions
		graph = Koala::Facebook::API.new(access_token)
		permissions = graph.get_connections(provider_id, "permissions")[0]
	end

	def login_user! omniauth_request
		self.update_attribute(:access_token, omniauth_request.credentials["token"])

		if(self.user.nil?)
			name = omniauth_request.info.first_name
			username = omniauth_request.info.nickname
		
			self.user = User.new_traveller({
				:name => name, 
				:photo_url => "https://graph.facebook.com/#{username}/picture"
			})
		end

		self.capture_permissions!

		self.save!
		self.user.login!

	end
end