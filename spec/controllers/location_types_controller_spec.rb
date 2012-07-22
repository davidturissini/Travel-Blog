require 'spec_helper'

describe LocationTypesController do
 fixtures :users, :location_types

 before(:each) do
  @user = users(:user_one)
  @location_type = @user.location_types.first
 end
 
 def stub_user_cookie
   request.cookies[:user] = {:id => @user.id}.to_json
 end
  
 def stub_referrer
  @request.env['HTTP_REFERER'] = "/"
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

  it "should complete successfully with json format" do
   get :show, :user_id => @user.id, :id => @location_type.id, :format => "json"
   response.should be_success
  end

  it "should render a json representation of the location_type" do
   get :show, :user_id => @user.id, :id => @location_type.id, :format => "json"
   response.body.should == @location_type.to_json
  end
 end

 context "/create" do
  it "should create a new location type" do
   stub_user_cookie
   stub_referrer
   title = "brand new very very unique location type title"
   post :create, :user_id => @user.id, :location_type => {:title => title}
   LocationType.find_by_title(title).should_not be_nil
  end

  it "shouldn't create a new location type if the current_user's id doesn't match the user id in the url" do
   request.cookies[:user] = {:id => users(:user_two).id}.to_json
   title = "Location type that shouldn't be created"
   loc_type_hash = {:title => title}
   post :create, :user_id => @user.id, :location_type => loc_type_hash
   LocationType.find_by_title(title).should be_nil 
  end
 end

 context "/destroy" do
  it "should destroy a location type" do
   stub_user_cookie
   stub_referrer
   l_id = @location_type.id
   post :destroy, :user_id => @user.id, :id => l_id
   lambda { LocationType.find(l_id) }.should raise_error( ActiveRecord::RecordNotFound )
  end
 end

 context "/update" do
  it "should complete successfully" do
   stub_user_cookie
   new_title = "New Title"
   loc_type_id = @location_type.id
   put :update, :user_id => @user.id, :id => @location_type.id, :location_type => { :title => new_title }
   response.should be_success
  end

  it "should update an existing location_type" do
   stub_user_cookie
   new_title = "New Title"
   loc_type_id = @location_type.id
   put :update, :user_id => @user.id, :id => @location_type.id, :location_type => { :title => new_title }
   LocationType.find(loc_type_id).title.should == new_title 
  end
 end

end
