class Map < ActiveRecord::Base
	belongs_to :trip
	has_one :user, :through => :trip
	validates :start_lng, :start_lat, :presence => true
	attr_accessible :map
	has_attached_file :map
	include HasFiles
	include HasSlug
	include HasDates
	include HasTitle

	def save_with_xml! xmldoc
		self.set_slug!(Digest::SHA1.hexdigest(xmldoc.to_xml), trip.maps)

		file = Tempfile.new(["map", "kml"])

		file.write xmldoc.to_xml

		file.rewind
		self.map = file
		self.save!
	end
end