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
end
