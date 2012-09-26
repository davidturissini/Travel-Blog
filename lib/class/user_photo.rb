class UserPhoto
	def self.create user
		options = { :url => user.photo_url }

		if( self.facebook_image?(user) )
			return UserFacebookPhoto.new(user)
		elsif( self.gravatar_image?(user) ) 
			return UserGravatarPhoto.new(user)
		end
	end

	def url
		@user.photo_url
	end

	private
	def self.gravatar_image? user
		return user.photo_url =~ /gravatar\.com/
	end

	def self.facebook_image? user
		return user.photo_url =~ /facebook\.com/ 
	end
end

class UserGravatarPhoto < UserPhoto
	@user
	def initialize user
		@user = user
	end

	def large
		return "#{@user.photo_url.strip}"
	end
end

class UserFacebookPhoto < UserPhoto
	@user
	def initialize user
		@user = user
	end

	def large
		return "#{@user.photo_url.strip}?type=large"
	end
end