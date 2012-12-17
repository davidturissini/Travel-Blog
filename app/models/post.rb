class Post < ActiveRecord::Base
	belongs_to :trip
	belongs_to :user
	include HasSlug
	include HasDates
end
