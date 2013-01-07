require 'spec_helper'

describe Admin::TripsController do
	fixtures :users, :trips, :maps, :locations, :posts

	describe "routing" do
		it "post request to #merge" do
	      expect(:post => "/user-slug/trip-slug/merge?merge_post_id=merge-post-slug").to route_to({
		      :controller => "admin/trips",
		      :action => "merge",
		      :user_id => "user-slug",
		      :trip_id => "trip-slug",
		      :format => "json"
		    })
	    end
	end

	describe "#merge" do

		before(:each) do
			@user = create(:user)

			@trip = create(:trip)
			@merge_trip = create(:trip)

			controller.stub!(:current_user).and_return(@user)

			@user.trips.stub!(:find_by_slug).with(@trip.slug).and_return(@trip)
			@user.trips.stub!(:find_by_slug).with(@merge_trip.slug).and_return(@merge_trip)

		end

		it "should call merge on the incoming trip" do
			@trip.should_receive(:merge!).with(@merge_trip)
			post :merge, :user_id => @user.slug, :trip_id => @trip.slug, :merge_trip_id => @merge_trip.slug, :format => "json"

		end

		it "should reload the trip" do
			@trip.should_receive(:reload)
			post :merge, :user_id => @user.slug, :trip_id => @trip.slug, :merge_trip_id => @merge_trip.slug, :format => "json"
		end

		it "should destroy the merged trip" do
			trip_id = @merge_trip.id
			post :merge, :user_id => @user.slug, :trip_id => @trip.slug, :merge_trip_id => @merge_trip.slug, :format => "json"

			lambda { Trip.find(trip_id) }.should raise_error ActiveRecord::RecordNotFound
		end

	end
end