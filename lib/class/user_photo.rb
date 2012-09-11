class UserPhoto
	def self.create user
		options = { :url => user.photo_url }

		if( self.facebook_image?(user) )
			return UserFacebookPhoto.new(user)
		end
	end

	def url
		@user.photo_url
	end

	private
	def self.facebook_image? user
		return user.photo_url =~ /facebook\.com/ 
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