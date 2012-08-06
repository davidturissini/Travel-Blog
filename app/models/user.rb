class User < ActiveRecord::Base
  has_many :location_types
  has_many :locations, :through => :location_types

  def self.anonymous
   User.find_by_slug("anonymous")
  end

  def anonymous?
   salt == "anonymous"
  end
  
  def owns? content
   content.user == self
  end
   
  def login!
    self.token = Digest::SHA1.hexdigest("#{salt}#{Time.now.to_i}")
    self.save!
    self
  end
 
  def logout!
   if !anonymous?
    self.token = nil
    self.save!
   end
  end

  def as_json options = {}
    hash = super(options)
    hash.delete("salt")
    hash
  end
 
  def self.new_traveller options
   user = User.create(options)
   user.salt = Digest::SHA1.hexdigest("#{user.id}#{Time.now.to_i}")
   user.slug = user.id
   user.save!
   LocationType.create_defaults({:user => user})
   user
  end

end
