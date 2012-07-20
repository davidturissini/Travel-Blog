require 'spec_helper'

describe UsersController do
 fixtures :users
 it "should render show" do
  get :show, :id => 1
  response.should be_success 
 end
end
