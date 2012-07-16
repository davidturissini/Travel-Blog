class JournalEntry < ActiveRecord::Base
 belongs_to :location
 has_one :location_type, :through => :location
 has_one :user, :through => :location_type
end
