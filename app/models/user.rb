require 'flickraw'

class User < ActiveRecord::Base
  has_many :location_types
  has_many :locations
  has_many :statuses, :through => :locations
  belongs_to :home_country, :class_name => "Country", :foreign_key => :country_id
  has_many :countries, :through => :locations
  has_many :realm_accounts
  validates :slug, :presence => true, :on => :update
  has_many :photos, :through => :locations

  def static_directory
    "#{CONFIG['static']['server']['path']}#{CONFIG['static']['user_path']}#{slug}/"
  end

  def create_static_dir_if_not_exists!
    if( !File.directory?(static_directory) )
      Dir.mkdir(static_directory)
    end
  end

  def flickr_sets
    flickr.access_token = flickr_account.access_token
    FlickRaw.shared_secret = flickr_account.shared_secret
    flickr.photosets.getList
  end

  def flickr_set_photos flickrset_id
    flickr.access_token = flickr_account.access_token
    FlickRaw.shared_secret = flickr_account.shared_secret
    flickr.photosets.getPhotos({:photoset_id => flickrset_id})
  end

  def photos_count
    photos.count
  end

  def create_subdir_if_not_exists! dir
    create_static_dir_if_not_exists!
    directory = "#{static_directory}#{dir}/"
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

  def has_flickr?
    !flickr_account.nil?
  end

  def flickr_account
    realm_accounts.where(:provider => "flickr").first
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
