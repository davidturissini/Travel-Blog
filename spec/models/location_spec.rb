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

 it "should have a teaser from its summary" do
  location = locations(:sample_vacation_with_summary)
  location.teaser.should == Sanitize.clean( location.summary )
 end

 it "should use it's journal entry body for teaser if summary is nil" do
  location = locations(:sample_vacation_with_nil_summary)
  entry = journal_entries(:journal_entry_for_nil_summary_location)
  location.teaser.should == Sanitize.clean(entry.body) 
 end

 it "should use it's journal entry body for teaser if summary is blank" do
  location = locations(:sample_vacation_with_blank_summary)
  entry = journal_entries(:journal_entry_for_blank_summary_location)
  location.teaser.should == Sanitize.clean(entry.body) 
 end
end
