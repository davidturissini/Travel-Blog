require 'spec_helper'

describe UsersController do
 fixtures :users
 context "show" do
  it "should render show" do
   get :show, :id => users(:user_one).slug
   response.should be_success 
  end
 end
end
