class Map < ActiveRecord::Base
	belongs_to :trip
	has_one :user, :through => :trip
	include HasFiles

	def save_with_xml! xmldoc
		self.slug = Digest::SHA1.hexdigest(xmldoc.to_xml)
		user.save_map!(StringIO.new(xmldoc.to_xml), "#{self.slug}.kml")
		self.save!
	end
end