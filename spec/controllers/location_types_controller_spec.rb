require 'spec_helper'

describe LocationTypesController do
 fixtures :users, :location_types

 before(:each) do
  @user = users(:user_one)
  @location_type = @user.location_types.first
 end

 context "/index" do
  it "should render index" do
   get :index, :user_id => @user.id, :id => @location_type.id
   response.should be_success 
  end
 end

 context "/update" do
  it "should update an existing location_type" do
   new_title = "New Title"
   loc_type_id = @location_type.id
   post :update, :user_id => @user.id, :id => @location_type.id, :location_type => { :title => new_title }
   LocationType.find(loc_type_id).title.should == new_title 
  end
 end

end
