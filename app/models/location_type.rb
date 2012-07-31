class LocationType < ActiveRecord::Base
  has_many :locations, :dependent => :destroy
  belongs_to :user
 
  def self.create_defaults options
   ["Vacations", "Road Trips", "Cruises"].each do |type|
     LocationType.create({
      :user => options[:user],
      :title => type,
      :slug => String.slugify(type)
     })
   end 
  end

end
