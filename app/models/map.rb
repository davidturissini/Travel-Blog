class Map < ActiveRecord::Base
	belongs_to :location
	has_one :user, :through => :location
	include HasFiles

	def save_with_xml! xmldoc
		self.slug = Digest::SHA1.hexdigest(xmldoc.to_xml)
		user.save_map!(StringIO.new(xmldoc.to_xml), "#{self.slug}.kml")
		self.save!
	end
end