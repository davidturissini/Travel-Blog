class Country < ActiveRecord::Base
	has_many :locations
	has_many :users, :through => :locations
end