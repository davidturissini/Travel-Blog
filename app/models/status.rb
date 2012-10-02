class Status < ActiveRecord::Base
	belongs_to :location
	has_one :user, :through => :location
	validates :location_id, :presence => true
end