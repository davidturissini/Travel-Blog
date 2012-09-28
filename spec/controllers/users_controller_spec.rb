require 'spec_helper'

describe UsersController do
 fixtures :users
 before(:each) do
  @user = users(:user_one)
 end

 def stub_user_cookie user = @user
   request.cookies[:user] = user.to_json
 end

 describe "/logout" do
  it "should log the user out" do
   user_id = @user.id
   stub_user_cookie
   get :logout
   User.find(user_id).token.should be_nil 
  end
 end
 
 context "show" do
  it "should render show" do
   get :show, :user_id => users(:user_one).slug
   response.should be_success 
  end
 end
end
