class Location < ActiveRecord::Base
 belongs_to :location_type
 has_one :user, :through => :location_type
 has_many :journal_entries, :order => "day DESC"
 validates :location_type_id, :presence => true
 
 def self.recent limit = 10
  self.joins(:location_type, :user).order("created_at DESC").limit(limit)
 end

 def self.with_recent_entries limit = 10
  JournalEntry.joins(:location, :location_type, :user).group(:location_id).order("created_at DESC").limit(limit).collect {|e| e.location }
 end

 def dates
  journal_entries.collect { |entry| entry.day }
 end
 
 def date_range
  return nil if !journal_entries?
  [journal_entries.first, journal_entries.last].collect { |entry| entry.day }.uniq
 end
 
 def journal_entries?
  journal_entries.length > 0
 end

 def teaser
  t = summary
  t = Sanitize.clean(journal_entries.order("day ASC").first.body) if t == ""
  t
 end
end
