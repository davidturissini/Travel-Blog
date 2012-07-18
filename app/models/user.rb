class User < ActiveRecord::Base
  has_many :location_types
  has_many :locations, :through => :location_types
   
  def login!
    self.token = rand(36**8).to_s(36) 
    self.save!
    self
  end

end
