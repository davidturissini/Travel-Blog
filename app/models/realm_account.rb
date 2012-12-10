class RealmAccount < ActiveRecord::Base
	belongs_to :user
	has_many :realm_permissions, :dependent => :destroy
	after_initialize :load_type_module

	def load_type_module
		if provider === "facebook"
			extend FacebookAccount
		elsif provider === "flickr"
			extend FlickrAccount
		end
	end

	def self.find_or_create_by_provider_and_provider_id provider, provider_id
		realm = RealmAccount.where({
			:provider => provider, 
			:provider_id => provider_id
			}).first

		if !realm
			realm = RealmAccount.create({
				:provider => provider,
				:provider_id => provider_id
				})
		end

		realm
	end
end