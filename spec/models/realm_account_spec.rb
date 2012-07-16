require 'spec_helper'

describe RealmAccount do
 fixtures :users, :realm_accounts
 before(:each) do
  @account = realm_accounts(:sample_realm)
 end
 it "should belong to a user" do
  user = users(:user_one)
  @account.user.should == user
 end
end
