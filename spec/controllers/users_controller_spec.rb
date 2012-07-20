require 'spec_helper'

describe UsersController do
 fixtures :users
 context "show" do
  it "should render show" do
   get :show, :id => 1
   response.should be_success 
  end
 end
end
