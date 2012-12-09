module FacebookAccount
	def distribute_trip trip
		graph = Koala::Facebook::API.new(access_token)
	    graph.put_connections(provider_id, "#{CONFIG['facebook']['namespace']}:visit", :trip => "http://samples.ogp.me/381205205302022")
	end

	def permission? action
		graph = Koala::Facebook::API.new(access_token)
		permissions = graph.get_connections(provider_id, "permissions")[0]
		permissions[action.to_s]
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

		self.save!
		self.user.login!

	end
end