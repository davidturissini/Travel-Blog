class Country < ActiveRecord::Base
	has_many :locations
	has_many :location_types, :through => :locations
	has_many :users, :through => :location_types
end