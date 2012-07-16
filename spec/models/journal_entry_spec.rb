require 'spec_helper'
describe JournalEntry do
 fixtures :users, :locations, :location_types, :journal_entries
 before(:each) do
  @entry = journal_entries(:sample_vacation_entry)
 end
 it "should belong to a location" do
  location = locations(:sample_vacation)
  @entry.location.should == location 
 end
 it "should have a location_type through its location" do
  location_type = location_types(:vacation)
  @entry.location_type.should == location_type
 end
 it "should have a user through its location_type" do
  user = users(:user_one)
  @entry.user.should == user
 end
end
