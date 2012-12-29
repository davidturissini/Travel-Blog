require 'spec_helper'

describe TripsController do
	fixtures :users, :trips

	describe "routing" do
		it "routes to #show" do
	      	expect(:get => "/user-slug/trip-slug").to route_to({
				:controller => "trips",
				:action => "show",
				:user_id => "user-slug",
				:id => "trip-slug"
		    })
	    end

	    it "routes to #index" do
	      	expect(:get => "/user-slug/trips").to route_to({
				:controller => "trips",
				:action => "index",
				:user_id => "user-slug"
			})
	    end
	end

	describe "GET index" do
		describe "FORMAT json" do
			before(:each) do
				@user = users(:user_one)
				@user.stub(:trips).and_return(Trip.where("id > 0"))
				controller.stub!(:current_user).and_return(@user)
			end

			it "should return a json list of user trips" do
				get :index, :user_id => @user.slug, :format => "json"
				response.body.should === @user.trips.to_json
			end
		end
	end

	describe "GET show" do
		describe "Requesting trip from existing user" do
			describe "Requesting trip that belongs to the user" do
				it "should be success" do
					user = users(:user_one)
					trip = trips(:trip_one)
					trip.stub!(:picture).and_return(Photo.new)
					Trip.stub!(:find_by_slug).and_return(trip)
					get :show, :user_id => user.slug, :id => trip.slug
					response.should be_success
				end

				it "should assign @page_title to trip title" do
					user = users(:user_one)
					trip = trips(:trip_one)
					trip.stub!(:picture).and_return(Photo.new)
					Trip.stub!(:find_by_slug).and_return(trip)
					get :show, :user_id => user.slug, :id => trip.slug
					assigns(:page_title).should == trip.title
				end

				it "should assign @og_title to trip title" do
					user = users(:user_one)
					trip = trips(:trip_one)
					trip.stub!(:picture).and_return(Photo.new)
					Trip.stub!(:find_by_slug).and_return(trip)
					get :show, :user_id => user.slug, :id => trip.slug
					assigns(:og_title).should == trip.title
				end

				it "should assign @canonical_url to trip url" do
					user = users(:user_one)
					trip = trips(:trip_one)
					trip.stub!(:picture).and_return(Photo.new)
					Trip.stub!(:find_by_slug).and_return(trip)
					get :show, :user_id => user.slug, :id => trip.slug
					assigns(:canonical_url).should == "http://test.host/#{user.slug}/#{trip.slug}"
				end

				it "should assign @og_image to trip picture url" do
					user = users(:user_one)
					trip = trips(:trip_one)
					photo_url = "http://url"
					photo = Photo.new
					photo.stub(:url).and_return(photo_url)
					trip.stub!(:picture).and_return(photo)
					Trip.stub!(:find_by_slug).and_return(trip)
					get :show, :user_id => user.slug, :id => trip.slug
					assigns(:og_image).should == photo.url
				end
			end

			describe "Requesting a trip that doesn't exist" do
				it "should be a 404" do
					user = users(:user_one)
					trip = trips(:trip_one)
					get :show, :user_id => user.slug, :id => "EWEWEGWEGWe"
					response.status.should eq(404)
				end
			end

			describe "Requesting a trip that exists but doesn't belong to the user" do
				it "should be a 404" do
					user = users(:user_one)
					trip = trips(:trip_two)
					get :show, :user_id => user.slug, :id => trip.slug
					response.status.should eq(404)
				end
			end
		end

		describe "Requesting trip from a non-existent user" do
			it "should be a 404" do
				get :show, :user_id => "ioegjgjeor", :id => "trip"
				response.status.should eq(404)
			end
		end
	end

end