class Location < ActiveRecord::Base
 belongs_to :location_type
 has_one :user, :through => :location_type
 has_many :journal_entries
end
