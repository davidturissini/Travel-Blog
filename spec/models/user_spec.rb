require 'spec_helper'
describe User do
 fixtures :users, :location_types, :locations
 before(:each) do
   @user = users(:user_one)
 end

 it "should find its location types" do
  location_type = location_types(:vacation)
  @user.location_types.should include(location_type) 
 end

 it "should find its locations through a location_type" do
  location = locations(:sample_vacation)
  @user.locations.should include(location)
 end
end
