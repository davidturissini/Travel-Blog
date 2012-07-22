require 'spec_helper'

describe LocationsController do
 fixtures :users, :location_types, :locations
 before(:each) do
  @location_type = location_types(:vacation)
  @user = @location_type.user
  @location = locations(:sample_vacation)
 end
 
 describe "/index" do
  it "should complete successfully" do
   get :index, :user_id => @user.slug, :location_type_id => @location_type.slug
   response.should be_success
  end

  it "should complete successfully with format=json" do
   get :index, :user_id => @user.slug, :location_type_id => @location_type.slug, :format => :json
   response.should be_success
  end
 end
 
 describe "/show" do
  it "should complete successfully" do
   get :show, :user_id => @user.slug, :location_type_id => @location_type.slug, :id => @location.slug
   response.should be_success
  end

  it "should complete successfully with format=json" do
   get :show, :user_id => @user.slug, :location_type_id => @location_type.slug, :id => @location.slug, :format => :json
   response.should be_success
  end
 end
end
