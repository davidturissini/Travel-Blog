class Trip < ActiveRecord::Base
	has_many :locations, :dependent => :destroy
 	has_many :maps, :dependent => :destroy
	has_and_belongs_to_many :photos, :join_table => "trips_photos"
	belongs_to :user
	belongs_to :photo
	validates :slug, :presence => true
	has_many :posts
	include HasSlug
 	include HasDates
 	include HasTitle

 	def self.random limit = 3
		limit(limit).order("RANDOM()")
	end

	def maps?
		maps.length > 0
	end

	def description
		summary || "#{user.name}'s visit to #{title} on #{date_string}"
	end

	def self.by_country
 		countries = {}
 		scoped.includes(:locations => [:country]).each do |trip|
 			trip.locations.each do |location|
 				country_name = location.country.name
 				countries[country_name] = [] if !countries[country_name]
 				countries[country_name].push(trip) if !countries[country_name].include?(trip)
 			end
 		end
 		countries
 	end

 	def self.by_year
 		years = {}
 		scoped.order("start_date DESC").each do |trip|
 			year = trip.year.nil? ? "" : trip.year
 			years[year] = [] if !years[year]
 			years[year].push(trip)
 		end
 		years
 	end

	def picture
		return photo if !photo.nil?
		first_location = locations.limit(1).first
		return first_location.picture if first_location
	end

	def newest_post
	    posts.order("created_at DESC").limit(1).first
	end

	def year
		return nil if !has_dates?
		start_date.strftime("%Y")
	end
end