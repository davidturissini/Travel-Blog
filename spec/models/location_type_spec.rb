require 'spec_helper'
describe LocationType do
 fixtures :users, :location_types, :locations
 before(:each) do 
  @location_type = location_types(:vacation)
 end
 it "should find its locations" do
  location = locations(:sample_vacation)
  @location_type.locations.should include(location)
 end
end
