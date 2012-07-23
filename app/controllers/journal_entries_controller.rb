class JournalEntriesController < ApplicationController
 def new 
  location = get_location
  @journal_entry = JournalEntry.new({:location => location})
 end 

 def create
  location = get_location 
  @journal = JournalEntry.create({:location => location}.merge(params[:journal_entry]))
 end
 
 protected
 def get_location
  user = User.find_by_slug(params[:user_id])
  location_type = user.location_types.find_by_slug(params[:location_type_id])
  location_type.locations.find_by_slug(params[:location_id]) 
 end
end
