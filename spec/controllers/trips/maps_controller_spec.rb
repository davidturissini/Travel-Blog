require 'spec_helper'

describe Trips::MapsController do
	fixtures :users, :trips, :maps, :locations

	describe "routing" do
	    it "trip maps route to #index" do
	      expect(:get => "/user-slug/trip-slug/maps").to route_to({
		      :controller => "trips/maps",
		      :action => "index",
		      :user_id => "user-slug",
		      :trip_id => "trip-slug"
		    })
	    end
	end

	describe "GET index" do
		describe "Requests from a user that doesn't exist" do
			it "should be a 404" do
				user = users(:user_one)
				trip = trips(:trip_one)
				get :index, :user_id => "ASDAS", :trip_id => trip.slug
				response.status.should eq(404)
			end
		end

		describe "Requests for a trip that doesn't exist" do
			it "should be a 404" do
				user = users(:user_one)
				trip = trips(:trip_one)
				get :index, :user_id => user.slug, :trip_id => "SDFG"
				response.status.should eq(404)
			end
		end

		describe "Requests for a trip and user that exists" do
			it "should be success" do
				user = users(:user_one)
				trip = trips(:trip_one)
				get :index, :user_id => user.slug, :trip_id => trip.slug
				response.should be_success
			end

			it "should assign @maps" do
				user = users(:user_one)
				trip = trips(:trip_one)
				get :index, :user_id => user.slug, :trip_id => trip.slug
				assigns(:maps).should == trip.maps
			end

			it "should assign @locations" do
				user = users(:user_one)
				trip = trips(:trip_one)
				get :index, :user_id => user.slug, :trip_id => trip.slug
				assigns(:locations).should == trip.locations
			end
		end
	end
end