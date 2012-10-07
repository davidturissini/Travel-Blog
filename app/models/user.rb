class User < ActiveRecord::Base
  has_many :location_types
  has_many :locations
  has_many :statuses, :through => :locations
  belongs_to :home_country, :class_name => "Country", :foreign_key => :country_id
  has_many :countries, :through => :locations
  has_many :realm_accounts
  validates :slug, :presence => true, :on => :update
  has_many :photos, :through => :locations

  def server_directory
    "#{Rails.root}/public/user_images/#{slug}/"
  end

  def create_server_dir_if_not_exists!
    if( !File.directory?(server_directory) )
      Dir.mkdir(server_directory)
    end
  end

  def photos_count
    photos.count
  end

  def create_subdir_if_not_exists! dir
    create_server_dir_if_not_exists!
    directory = "#{server_directory}#{dir}/"
    if( !File.directory?(directory) )
      Dir.mkdir(directory)
    end
    directory
  end

  def random_locations limit = 5
    locations.limit(limit).order("RAND()")
  end

  def location?
    !(latitude.nil? && longitude.nil?)
  end

  def photo
    @photo ||= UserPhoto.create(self)
  end

  def facebook
    realm_accounts.where(:provider => "facebook").first
  end

  def facebook_id
    facebook.provider_id
  end

  def facebook_token
    facebook.access_token
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

  def incomplete?
    slug.nil?
  end

  def anonymous?
   salt == "anonymous"
  end
  
  def owns? content
   content.user == self
  end
   
  def login!
    self.token = Digest::SHA1.hexdigest("#{salt}#{Time.now.to_i}")
    self.save!(:validate => false)
    self
  end
 
  def logout!
   if !anonymous?
    self.token = nil
    self.save!(:validate => false)
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
   user.save!(:validate => false)
   user
  end

end
