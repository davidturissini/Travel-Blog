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

 context "/show" do
  it "should complete successfully" do
   get :show, :user_id => @user.id, :id => @location_type.id
   response.should be_success
  end
 end

 context "/create" do
  it "should create a new location type" do
   title = "brand new very very unique location type title"
   post :create, :user_id => @user.id, :location_type => {:title => title}
   LocationType.find_by_title(title).should_not be_nil
  end
 end

 context "/update" do
  it "should complete successfully" do
   new_title = "New Title"
   loc_type_id = @location_type.id
   put :update, :user_id => @user.id, :id => @location_type.id, :location_type => { :title => new_title }
   response.should be_success
  end

  it "should update an existing location_type" do
   new_title = "New Title"
   loc_type_id = @location_type.id
   put :update, :user_id => @user.id, :id => @location_type.id, :location_type => { :title => new_title }
   LocationType.find(loc_type_id).title.should == new_title 
  end
 end

end
