require 'flickraw'

class User < ActiveRecord::Base
  has_many :location_types
  has_many :trips, :order => "start_date DESC"
  has_many :locations, :through => :trips
  has_many :maps, :through => :trips
  has_many :statuses, :through => :locations
  belongs_to :home_country, :class_name => "Country", :foreign_key => :country_id
  has_many :countries, :through => :locations
  has_many :realm_accounts
  validates :slug, :presence => true, :on => :update
  has_many :photos
  include HasFiles
  include HasSlug

  def static_directory
    "#{CONFIG['static']['user_path']}#{slug}/"
  end

  def create_user_dir!
    create_dir_if_not_exists! "#{static_directory}"
  end

  def create_content_dir! dir
    create_dir_if_not_exists! "#{static_directory}#{dir}"
  end

  def save_photo! file, path
    save_file(file, { :path => "#{static_directory}photos/#{path}" })
  end

  def save_map! file, path
    create_content_dir! "maps"
    save_file(file, { :path => "#{static_directory}maps/#{path}" })
  end

  def stage_map! xmldoc
    _slug = Digest::SHA1.hexdigest(xmldoc.to_xml)
    file = StringIO.new(xmldoc.to_xml)
    path = "#{_slug}.kml"
    create_content_dir! "stage/maps"
    save_file(file, { :path => "#{static_directory}stage/maps/#{path}" })
    "http://#{CONFIG['static']['domain']}/#{static_directory}stage/maps/#{path}"
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

  def random_locations limit = 5
    locations.limit(limit).order("RANDOM()")
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
    return false if content.nil? || !content.user
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
