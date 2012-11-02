class Trip < ActiveRecord::Base
	has_many :locations, :dependent => :destroy
 	has_many :maps, :dependent => :destroy
	has_and_belongs_to_many :photos, :join_table => "trips_photos"
	belongs_to :user
	belongs_to :photo
	validates :slug, :presence => true
	has_many :journals
	include HasSlug
 	include HasDates
 	include HasTitle

 	def self.random limit = 3
		limit(limit).order("RAND()")
	end

	def maps?
		maps.length > 0
	end

 	def self.by_year
 		years = {}
 		scoped.each do |trip|
 			years[trip.year] = [] if !years[trip.year]
 			years[trip.year].push(trip)
 		end
 		years
 	end

	def picture
		return photo if !photo.nil?
		first_location = locations.limit(1).first
		return first_location.picture if first_location
	end

	def newest_journal
	    journals.order("created_at DESC").limit(1).first
	end

	def year
		start_date.strftime("%Y")
	end
end