require 'spec_helper'
describe User do
 fixtures :users, :location_types, :locations
 before(:each) do
   @user = users(:user_one)
   @anonymous = users(:anonymous)
 end

 it "should find its location types" do
  location_type = location_types(:vacation)
  @user.location_types.should include(location_type) 
 end

 it "should find its locations through a location_type" do
  location = locations(:sample_vacation)
  @user.locations.should include(location)
 end

 it "should not have its salt in its json" do
 	@user.as_json.should_not have_key("salt")
 end

 context "anonymous?" do
 	it "should return true when user is anonymous" do
 		@anonymous.anonymous?.should be_true
 	end

 	it "should return false when user is not anonymous" do
 		@user.anonymous?.should be_false
 	end
 end
end
