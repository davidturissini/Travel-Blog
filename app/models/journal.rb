class Journal < ActiveRecord::Base
 belongs_to :trip
 has_one :user, :through => :trip
 validates :slug, :trip_id, :presence => true
 include HasSlug
 include HasDates
end
