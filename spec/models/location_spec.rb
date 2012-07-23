require 'spec_helper'
describe Location do
 fixtures :location_types, :users, :journal_entries, :locations
 before(:each) do
  @location = locations(:sample_vacation)
 end
 it "should find its location type" do
  location_type = location_types(:vacation)
  @location.location_type.should == location_type
 end
 
 it "should have many journal entries" do
  @location.journal_entries.should be_kind_of(Array) 
 end

 it "should find its journal entries" do
  journal_entry = journal_entries(:sample_vacation_entry)
  @location.journal_entries.should include(journal_entry) 
 end
 
 it "should not create a location without a location type" do
  lambda { Location.create!({:title => "asd"}) }.should raise_error(ActiveRecord::RecordInvalid)
 end
end
