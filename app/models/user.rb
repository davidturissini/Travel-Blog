class User < ActiveRecord::Base
  has_many :location_types
  has_many :locations, :through => :location_types
  belongs_to :home_country, :class_name => "Country", :foreign_key => :country_id
  has_many :countries, :through => :locations
  has_many :realm_accounts

  def random_locations limit = 5
    locations.limit(limit).order("RAND()").where("has_visited" => true)
  end

  def visited_locations options = {}
    locations.where("has_visited=true").order("id DESC")
  end

  def photo
    @photo ||= UserPhoto.create(self)
  end

  def facebook_token
    realm_accounts.where(:provider => "facebook").first.access_token
  end

  def countries_count
    countries.group("countries.id").count.length
  end

  def country_name
    home_country.name if home_country
  end

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
