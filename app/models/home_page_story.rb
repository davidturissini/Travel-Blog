class HomePageStory < ActiveRecord::Base
	belongs_to :photo

	#static
	def self.new_from_trip trip, options = {}

		init_options = {
					:title => trip.title,
					:text => trip.summary,
					:photo_id => trip.photo.nil? ? nil : trip.photo.id,
					:url => "/#{trip.user.slug}/#{trip.slug}",
					:small_photo_url => trip.user.picture.large
				}

		self.new init_options.merge(options)
	end

	def self.create_from_trip trip, options = {}
		trip = self.new_from_trip trip, options
		trip.save!
		trip
	end

	#instance
	def picture
		photo.nil? ? Photo.new : photo
	end
end