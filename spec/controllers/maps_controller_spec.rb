require 'spec_helper'

describe MapsController do
	fixtures :users, :trips, :maps, :locations

	describe "routing" do
		it "user maps route to #index" do
	      expect(:get => "/user-slug/maps").to route_to({
		      :controller => "maps",
		      :action => "index",
		      :user_id => "user-slug"
		    })
	    end
	end

	describe "GET index" do
		describe "Requests from a user that doesn't exist" do
			it "should be a 404" do
				user = users(:user_one)
				get :index, :user_id => "ASDAS"
				response.status.should eq(404)
			end
		end

		describe "Requests for a user that exists" do
			it "should be success" do
				user = users(:user_one)
				get :index, :user_id => user.slug
				response.should be_success
			end

			it "should assign @maps" do
				user = users(:user_one)
				get :index, :user_id => user.slug
				assigns(:maps).should == user.maps
			end

			it "should assign @locations" do
				user = users(:user_one)
				get :index, :user_id => user.slug
				assigns(:locations).should == user.locations
			end
		end
	end
end