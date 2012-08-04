class JournalEntriesController < ApplicationController
 def edit
  if validate_user?
   @journal_entry = get_location.journal_entries.find(params[:id]) 
  end
 end
 
 def update
  if validate_user?
   @journal_entry = JournalEntry.find(params[:id])  
   @journal_entry.update_attributes!(params[:journal_entry])
   respond_to do |format|
    format.html { redirect_to :controller => :locations, :action => :show, :id => @journal_entry.location.slug }
   end
  end
 end

 def new 
  if validate_user?
   location = get_location
   @journal_entry = JournalEntry.new({:location => location})
  end
 end 

 def create
  if validate_user?
   location = get_location 
   @journal = JournalEntry.create({:location => location}.merge(params[:journal_entry]))
   respond_to do |format|
    format.html { redirect_to :controller => "locations", :action => "show", :location_type_id => location.location_type.slug, :user_id => current_user.slug, :id => location.slug }
   end
  end
 end

 def destroy
  if validate_user?
    location = get_location 
    @journal = location.journal_entries.find(params[:id])
    @journal.destroy
    respond_to do |format|
     format.html { redirect_to :controller => "locations", :action => "show", :location_type_id => location.location_type.slug, :user_id => current_user.slug, :id => location.slug }
    end
  end
 end
 
 protected
 def get_location
  user = User.find_by_slug(params[:user_id])
  location_type = user.location_types.find_by_slug(params[:location_type_id])
  location_type.locations.find_by_slug(params[:location_id]) 
 end
end
