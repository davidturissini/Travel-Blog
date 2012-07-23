class User < ActiveRecord::Base
  has_many :location_types
  has_many :locations, :through => :location_types
   
  def login!
    self.token = rand(36**8).to_s(36) 
    self.save!
    self
  end
 
  def logout
   self.token = nil
   self.save!
  end
 
  def self.new_traveller options
   user = User.create(options)
   user.slug = user.id
   user.save!
   LocationType.create_defaults({:user => user})
   user
  end

end
