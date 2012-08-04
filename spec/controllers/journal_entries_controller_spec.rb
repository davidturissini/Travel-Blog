require 'spec_helper'

describe JournalEntriesController do
 fixtures :users, :location_types, :locations, :journal_entries

 before(:each) do
 	@user = users(:user_one)
 	@location_type = @user.location_types.first
 	@location = @location_type.locations.first
 end

 def stub_user_cookie user = @user
   request.cookies[:user] = user.to_json
 end
  
 def stub_referrer
  @request.env['HTTP_REFERER'] = "/"
 end

 def journal_entry_hash
 	{
 		:title => "title",
 		:body => "body",
 		:day => "12/12/12"
 	}
 end

 describe "/edit" do
  it "should complete successfully" do
    stub_user_cookie
    entry = @location.journal_entries.first
    get :edit, :id => entry.id, :user_id => @user.slug, :location_type_id => @location_type.slug, :location_id => @location.slug
    response.should be_success
  end

  it "should not complete successfully if user doesn't match" do
    stub_user_cookie(users(:anonymous))
    entry = @location.journal_entries.first
    get :edit, :id => entry.id, :user_id => @user.slug, :location_type_id => @location_type.slug, :location_id => @location.slug
    response.status.should == 302
  end
 end

 describe "/create" do
  it "should complete successfully" do
   stub_user_cookie
   post :create, :user_id => @user.slug, :location_type_id => @location_type.slug, :location_id => @location.slug, :journal_entry => journal_entry_hash
   response.status.should == 302
  end

  it "should create a new journal entry successfully" do
   stub_user_cookie
   title = "ADASDASDASDASWRGBERET"
   hash = journal_entry_hash.merge({:title => title})
   post :create, :user_id => @user.slug, :location_type_id => @location_type.slug, :location_id => @location.slug, :journal_entry => hash
   JournalEntry.find_by_title(title).should_not be_nil
  end

  it "should not create a new journal entry successfully if the user is incorrect" do
   stub_user_cookie(users(:anonymous))
   title = "ADASDASDASDASWRGBERET"
   hash = journal_entry_hash.merge({:title => title})
   post :create, :user_id => @user.slug, :location_type_id => @location_type.slug, :location_id => @location.slug, :journal_entry => hash
   JournalEntry.find_by_title(title).should be_nil
  end
 end

 describe "/edit" do

 end
end