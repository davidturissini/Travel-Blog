class User < ActiveRecord::Base
  has_many :location_types
  has_many :locations, :through => :location_types
end
