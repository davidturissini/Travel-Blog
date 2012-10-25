class Location < ActiveRecord::Base
 belongs_to :trip
 belongs_to :country
 has_one :user, :through => :trip
 has_many :journal_entries, :order => "day ASC"
 has_and_belongs_to_many :photos
 has_many :statuses, :dependent => :destroy
 validates :slug, :latitude, :longitude, :country_id, :presence => true
 include HasSlug
 include HasDates

  def journal_entries_count
    journal_entries.count
  end

  def photos_count
    photos.count
  end

  def smart_title
    return title if title
    geo_string
  end 

  def geo_string
    s = ""
      if( !city.blank? && state )
          s = "#{city}, #{state}"
      elsif (city.blank? && state && country)
          s = "#{state}, #{country_name}"
      elsif (!city.blank? && country)
          s = "#{city}, #{country_name}"
      elsif country
          s = country_name
      end
      s
  end

  def picture
      return GoogleMapPhoto.new(self)
  end

 def country_name
  country.name if country
 end
 
 def self.recent limit = 10
  self.joins(:location_type, :user).order("created_at DESC").limit(limit)
 end

 def self.most_recent_published
   self.joins(:journal_entries, :location_type, :user).order("journal_entries.day DESC").group("journal_entries.location_id")
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
 
 def teaser
  t = ""
  if t == "" || t.nil?
    entry = journal_entries.where("body IS NOT NULL").order("day ASC").first
    t = Sanitize.clean(entry.body) if !entry.nil?
  end
  t
 end

 private
 def flickr
  @flickr ||= FlickRaw::Flickr.new
 end
end
