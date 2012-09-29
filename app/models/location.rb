class Location < ActiveRecord::Base
 belongs_to :user
 belongs_to :country
 has_many :journal_entries, :order => "day ASC"
 validates :slug, :title, :presence => true
 
 def self.random limit = 3
  limit(limit).order("RAND()").where("has_visited" => true)
 end

 def country_name
  country.name if country
 end
 
 def self.recent limit = 10
  self.joins(:location_type, :user).order("created_at DESC").limit(limit)
 end

 def self.most_recent_published
   self.joins(:journal_entries, :location_type, :user).where("locations.has_visited = true").order("journal_entries.day DESC").group("journal_entries.location_id")
 end

 def self.with_recent_entries limit = 10
  JournalEntry.joins(:location, :location_type, :user).group(:location_id).order("created_at DESC").limit(limit).collect {|e| e.location }
 end

 def dates
  journal_entries.collect { |entry| entry.day }
 end
  
 def date_range?
  date_range.length > 0
 end
 
 def date_range
  return [] if !journal_entries?
  [journal_entries.first, journal_entries.last].collect { |entry| entry.day }.uniq.compact
 end

 def related limit = 5
  user.random_locations(limit)
 end
 
 def journal_entries?
  journal_entries.length > 0
 end

 def photos
  return [] if !flickr_set
  Rails.cache.fetch("location-#{id}-photos", :expires_in => 1.minute) do
    photos = flickr.photosets.getPhotos(:photoset_id => flickr_set)
    photos['photo']
  end
 end

 def teaser
  t = summary
  t = Sanitize.clean(journal_entries.where("body IS NOT NULL").order("day ASC").first.body) if t == "" || t.nil?
  t
 end

 private
 def flickr
  @flickr ||= FlickRaw::Flickr.new
 end
end
