class Photo < ActiveRecord::Base
	has_and_belongs_to_many :locations
	has_one :user, :through => :locations

	def url
		"/user_images/#{user.slug}/photos/500/#{slug}.jpg"
	end

	def user
		@user || locations.first.user
	end
end