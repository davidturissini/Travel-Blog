class Trip < ActiveRecord::Base
	has_many :locations, :dependent => :destroy
 	has_many :maps, :dependent => :destroy
	has_and_belongs_to_many :photos, :join_table => "trips_photos"
	belongs_to :user
	belongs_to :photo
	validates :slug, :presence => true

	def picture
		return photo if !photo.nil?
		first_location = locations.limit(1).first
		return first_location.picture if first_location
	end
 
	def self.random limit = 3
		limit(limit).order("RAND()")
	end
end