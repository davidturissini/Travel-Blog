require 'spec_helper'

describe UsersController do
	fixtures :users
	describe "routing" do
		it "routes to #show" do
	      expect(:get => "/user-slug").to route_to({
		      :controller => "users",
		      :action => "show",
		      :user_id => "user-slug"
		    })
	    end

	    it "routes to #validate_slug" do
	    	expect(:get => "/users/validate_slug?slug=foo").to route_to({
		      :controller => "users",
		      :action => "validate_slug"
		      })
	    end

	    it "routes to #logout" do
	    	expect(:get => "/me/logout").to route_to({
		      :controller => "users",
		      :action => "logout",
		      :user_id => "me"
		      })
	    end

	    it "routes to #login" do
	    	expect(:get => "/auth/facebook/callback").to route_to({
		      :controller => "users",
		      :action => "login",
		      :provider => "facebook"
		      })
	    end
	end

	describe "GET show" do
		describe "Requesting existing user" do
			it "should complete successfully" do
				get :show, :user_id => "dave"
				response.should be_success
			end
		end

		describe "Requesting user that doesn't exist" do
			it "should have a status of 404" do
				get :show, :user_id => "doesnt_exist"
				response.status.should == 404
			end
		end
	end

	describe "GET validate_slug" do
		fixtures :users

		describe "response" do

			it "should be a json object" do
				slug = "unique-slug"
				get :validate_slug, :slug => slug
				response.body.should === { "slug" => slug }.to_json
			end

			it "should have 'slug' key" do
				get :validate_slug, :slug => "unique-slug"
				json = JSON.parse( response.body )
				json.should have_key("slug")
			end
		end

		describe "Checking unique slug" do
			it "should return the slug passed" do
				slug = "unique-slug"
				get :validate_slug, :slug => slug
				json = JSON.parse( response.body )
				json["slug"].should === slug
			end
		end

		describe "Checking non-unique slug" do
			it "should return the slug with '-1' appended" do
				slug = "dave"
				get :validate_slug, :slug => slug
				json = JSON.parse( response.body )
				json["slug"].should === "#{slug}-1"
			end
		end
	end

	describe "GET logout" do
		it "should be a redirect" do
			controller.stub!(:current_user).and_return(users(:user_one))
			get :logout, :user_id => "me"
			response.should be_redirect
		end

		it "should call logout! on current user" do
			user = users(:user_one)
			controller.stub!(:current_user).and_return(users(:user_one))
			user.should_receive(:logout!)
			get :logout, :user_id => "me"
		end
	end
end