require 'spec_helper'

describe LocationsController do
 fixtures :users, :location_types, :locations
 before(:each) do
  @location_type = location_types(:vacation)
  @user = @location_type.user
  @location = locations(:sample_vacation)
 end

 def stub_user_cookie user = @user
   request.cookies[:user] = user.to_json
 end
  
 def stub_referrer
  @request.env['HTTP_REFERER'] = "/"
 end

 describe "/destroy" do
  it "should complete redirect" do
    stub_user_cookie
    delete :destroy, :user_id => @user.slug, :location_type_id => @location_type.slug, :id => @location.slug
    response.status.should == 302
  end

  it "should delete a location" do
    stub_user_cookie
    loc_id = @location.id
    delete :destroy, :user_id => @user.slug, :location_type_id => @location_type.slug, :id => @location.slug
    lambda { Location.find(loc_id) }.should raise_error( ActiveRecord::RecordNotFound )
  end

  it "should delete a location with format json" do
    stub_user_cookie
    loc_id = @location.id
    delete :destroy, :format => "json", :user_id => @user.slug, :location_type_id => @location_type.slug, :id => @location.slug
    lambda { Location.find(loc_id) }.should raise_error( ActiveRecord::RecordNotFound )
  end

  it "should not delete a location with an incorrect user" do
    stub_user_cookie(users(:anonymous))
    loc_id = @location.id
    delete :destroy, :format => "json", :user_id => @user.slug, :location_type_id => @location_type.slug, :id => @location.slug
    Location.find(loc_id).should_not be_nil
  end
 end
 
 describe "/edit" do
  it "should complete successfully" do
   stub_user_cookie
   get :edit, :user_id => @user.slug, :location_type_id => @location_type.slug, :id => @location.slug
   response.should be_success
  end 

  it "should not complete successfully if incorrect user" do
    stub_user_cookie(users(:anonymous))
    get :edit, :user_id => @user.slug, :location_type_id => @location_type.slug, :id => @location.slug
    response.status.should == 302
  end
 end

 describe "/update" do
  it "should update a location successfully" do
   stub_referrer
   stub_user_cookie
   new_title = "this is a very very very new title"
   put :update, :user_id => @user.slug, :location_type_id => @location_type.slug, :id => @location.slug, :location => { :title => new_title }
   Location.find(@location.id).title.should == new_title 
  end

  it "should not complete successfully if incorrect user" do
    stub_user_cookie(users(:anonymous))
    put :update, :user_id => @user.slug, :location_type_id => @location_type.slug, :id => @location.slug, :location => { :title => "new  title" }
    response.status.should == 302
  end
 end
 
 describe "/create" do
  it "should create a new location" do
   stub_referrer
   stub_user_cookie
   title = "new location title that should be created"
   loc_hash = { :title => title }
   post :create, :user_id => @user.slug, :location_type_id => @location_type.slug, :location => loc_hash
   Location.find_by_title(title).should_not be_nil
  end

  it "should not create a new location if the user id doesn't match the cookie user id" do
   stub_referrer
   stub_user_cookie(users(:anonymous))
   title = "new location title that should be created"
   loc_hash = { :title => title }
   post :create, :user_id => @user.slug, :location_type_id => @location_type.slug, :location => loc_hash
   Location.find_by_title(title).should be_nil
  end

  it "should create a new location with an appropriate slug" do
   stub_referrer
   stub_user_cookie
   title = "new location title that should be created"
   loc_hash = { :title => title, :slug => "this is a slug93283r@#R*@$)T*#$HGWRGQO#%$*GHQGR" }
   post :create, :user_id => @user.slug, :location_type_id => @location_type.slug, :location => loc_hash
   Location.find_by_title(title).slug.should == String.slugify( loc_hash[:slug] )
  end
 
  it "should create a new location with a slug even if a slug param is not present" do
   stub_referrer
   stub_user_cookie
   title = "new location title that should be created"
   loc_hash = { :title => title }
   post :create, :user_id => @user.slug, :location_type_id => @location_type.slug, :location => loc_hash
   Location.find_by_title(title).slug.should == String.slugify( title )
  end
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
