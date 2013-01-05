require 'spec_helper'

describe PhotosController do
	fixtures :users, :trips, :maps, :locations

	describe "routing" do
		it "user maps route to #index" do
	      expect(:get => "/user-slug/trip-slug/photos").to route_to({
		      :controller => "photos",
		      :action => "index",
		      :user_id => "user-slug",
		      :trip_id => "trip-slug"
		    })
	    end

	    it "trip maps route to #index" do
	      expect(:get => "/user-slug/photos").to route_to({
		      :controller => "photos",
		      :action => "index",
		      :user_id => "user-slug"
		    })
	    end
	end

	describe "GET index" do
		describe "Requests for a user that doesn't exist" do
			it "should be a 404" do
				User.stub!(:find_by_slug).and_return(nil)
				get :index, :user_id => "ASDAS"
				response.status.should eq(404)
			end
		end

		describe "Requests for a user that does exist" do
			describe "Requests without a trip_id" do
				it "should be a success" do
					user = users(:user_one)
					get :index, :user_id => user.slug
					response.should be_success
				end

				it "should get user.photos" do
					user = users(:user_one)
					User.stub!(:find_by_slug).and_return(user)
					user.should_receive(:photos).and_return(Photo.where("id > 0"))
					get :index, :user_id => user.slug
				end
			end

			describe "Requests with a trip_id" do
				describe "Requests with trip that doesn't exist" do
					it "should be a 404" do
						user = users(:user_one)
						User.stub!(:find_by_slug).and_return(user)
						Trip.stub!(:find_by_slug).and_return(nil)
						get :index, :user_id => "user", :trip_id => "trip"
						response.status.should eq(404)
					end
				end

				describe "Requests with a trip that does exist" do
					it "should be a success" do
						user = users(:user_one)
						trip = trips(:trip_one)
						get :index, :user_id => user.slug, :trip_id => trip.slug
						response.should be_success
					end

					it "should call trip.photos" do
						user = users(:user_one)
						trip = trips(:trip_one)
						photos_stub = [Photo.new, Photo.new]
						Trip.stub!(:find_by_slug).and_return(trip)
						trip.should_receive(:photos).and_return(Photo.where("id > 0"))
						get :index, :user_id => user.slug, :trip_id => trip.slug
					end

				end
			end
		end
	end
end