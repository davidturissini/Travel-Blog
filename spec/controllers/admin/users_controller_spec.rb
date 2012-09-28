require 'spec_helper'

describe Admin::UsersController do
 fixtures :users
 before(:each) do
  @user = users(:user_one)
 end

 def stub_user_cookie user = @user
   request.cookies[:user] = user.to_json
 end

 describe "/me" do
  it "should redirect if user is anonymous" do
    stub_user_cookie(users(:anonymous))
    get :me
    response.status.should == 302
  end
 end

  describe "/update" do
  it "should complete successfully" do
    stub_user_cookie
    put :update, :user => @user.as_json
    response.status.should == 302
  end

  it "should update the user" do
    stub_user_cookie
    hash = @user.as_json
    user_id = @user.id
    name = "ASDASDSADASDASD"
    hash[:name] = name
    put :update, :user => hash
    User.find(user_id).name.should == name
  end

  it "should not update an anonymous user" do
    anon = users(:anonymous)
    stub_user_cookie(anon)
    hash = anon.as_json
    user_id = anon.id
    slug = "ASDASDSADASDASD"
    old_slug = hash["slug"]
    hash[:slug] = slug
    put :update, :user => hash
    User.find(user_id).slug.should == old_slug
  end

  it "should not update the users token" do
    stub_user_cookie
    hash = @user.as_json
    user_id = @user.id
    user_token = User.find(user_id).token
    token = "ASDASDSADASDASD"
    hash[:token] = token
    put :update, :user => hash
    User.find(user_id).token.should == user_token
  end

  it "should not update the users salt" do
    stub_user_cookie
    hash = @user.as_json
    user_id = @user.id
    user_salt = User.find(user_id).salt
    salt = "ASDASDSADASDASD"
    hash[:salt] = salt
    put :update, :user => hash
    User.find(user_id).salt.should == user_salt
  end
 end

end
