class Post < ActiveRecord::Base
	belongs_to :trip
	belongs_to :user
	validates :slug, :trip_id, :presence => true
	include HasSlug
	include HasDates
end
