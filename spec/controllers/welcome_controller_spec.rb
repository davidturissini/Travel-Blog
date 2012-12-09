require 'spec_helper'

describe WelcomeController do
	fixtures :users
	describe "routing" do
		it "routes to #index" do
			expect(:get => "/").to route_to({
		      :controller => "welcome",
		      :action => "index"
		    })
		end
		it "routes to #welcome_user" do
			expect(:get => "/welcome").to route_to({
		      :controller => "welcome",
		      :action => "user"
		    })
		end
	end

	describe "GET index" do
		describe "When current_user is anonymous" do
			it "should not be a redirect" do
				user = users(:anonymous)
				controller.stub!(:current_user).and_return(user)
				user.stub!(:anonymous?).and_return(true)
				get :index
				response.should_not be_redirect
			end
		end

		describe "When current_user is incomplete" do
			it "should be a redirect" do
				user = users(:anonymous)
				controller.stub!(:current_user).and_return(user)
				user.stub!(:incomplete?).and_return(true)
				get :index
				response.should be_redirect
			end

			it "should redirect to welcome_user_path" do
				user = users(:anonymous)
				controller.stub!(:current_user).and_return(user)
				user.stub!(:incomplete?).and_return(true)
				get :index
				response.should redirect_to(welcome_user_path)
			end
		end

		describe "When current_user is not anonymous or incomplete" do
			it "should be a redirect" do
				user = users(:user_one)
				controller.stub!(:current_user).and_return(user)
				user.stub!(:anonymous?).and_return(false)
				user.stub!(:incomplete?).and_return(false)
				get :index
				response.should be_redirect
			end

			it "should be a redirect" do
				user = users(:user_one)
				controller.stub!(:current_user).and_return(user)
				user.stub!(:anonymous?).and_return(false)
				user.stub!(:incomplete?).and_return(false)
				get :index
				response.should redirect_to(user_path(:id => user.slug))
			end
		end
	end

	describe "GET user" do
		describe "When current_user is anonymous" do
			it "should be a redirect" do
				user = users(:anonymous)
				controller.stub!(:current_user).and_return(user)
				user.stub!(:anonymous?).and_return(true)
				get :user
				response.should be_redirect
			end
		end

		describe "When current_user is incomplete" do
			it "should be a redirect" do
				user = users(:anonymous)
				controller.stub!(:current_user).and_return(user)
				user.stub!(:incomplete?).and_return(true)
				get :user
				response.should be_redirect
			end
		end

		describe "When current_user is not anonymous or incomplete" do
			it "should not be a redirect" do
				user = users(:user_one)
				controller.stub!(:current_user).and_return(user)
				user.stub!(:anonymous?).and_return(false)
				user.stub!(:incomplete?).and_return(false)
				get :user
				response.should be_redirect
			end
		end
	end
end