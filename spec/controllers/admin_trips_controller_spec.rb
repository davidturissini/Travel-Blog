require 'spec_helper'

describe Admin::TripsController do
	fixtures :users, :trips, :maps, :locations

	before(:each) do
		controller.stub!(:validate_user?).and_return(true)
	end

	describe "routing" do
		it "should route to #distribute" do
	      expect(:get => "/user-slug/trip-slug/distribute").to route_to({
		      :controller => "admin/trips",
		      :action => "distribute",
		      :user_id => "user-slug",
		      :trip_id => "trip-slug"
		    })
	    end
	end

	describe "Requests for a trip that exists" do
		describe "If user has permission to publsh_actions" do
			it "should be a redirect" do
				user = users(:user_one)
				trip = trips(:trip_one)
				realm = RealmAccount.new

				accounts = RealmAccount.where("id > 0")
				user.trips.stub!(:find_by_slug).and_return(trip)
				trip.stub!(:distribute!).and_return(true)
				controller.stub!(:current_user).and_return(user)
				user.stub!(:realm_accounts).and_return(accounts)
				accounts.stub!(:find_by_provider).and_return(realm)
				realm.stub!(:permission?).and_return(true)
				
				
				get :distribute, :user_id => user.slug, :trip_id => "doesnt-exist"
				response.should be_redirect
			end

			it "should be a call distribute! on the trip" do
				user = users(:user_one)
				trip = trips(:trip_one)
				realm = RealmAccount.new

				accounts = RealmAccount.where("id > 0")
				
				controller.stub!(:current_user).and_return(user)
				user.trips.stub!(:find_by_slug).and_return(trip)
				trip.stub!(:distribute!).and_return(true)
				user.stub!(:realm_accounts).and_return(accounts)
				accounts.stub!(:find_by_provider).and_return(realm)
				realm.stub!(:permission?).and_return(true)
				
				
				get :distribute, :user_id => user.slug, :trip_id => "doesnt-exist"
				trip.should_receive :distribute!
			end
		end

		describe "If user doesn't have permission to publish_actions" do
			it "should be a redirect" do
				user = users(:user_one)
				trip = trips(:trip_one)
				realm = RealmAccount.new

				accounts = RealmAccount.where("id > 0")
				
				controller.stub!(:current_user).and_return(user)
				user.trips.stub!(:find_by_slug).and_return(trip)
				trip.stub!(:distribute!).and_return(true)
				user.stub!(:realm_accounts).and_return(accounts)
				accounts.stub!(:find_by_provider).and_return(realm)
				realm.stub!(:permission?).and_return(false)

				get :distribute, :user_id => user.slug, :trip_id => "doesnt-exist"
				response.should be_redirect
			end
		end
	end

	describe "Requests for a trip that doesn't exist" do
		it "should be a 404" do
			user = users(:user_one)
			get :distribute, :user_id => user.slug, :trip_id => "doesnt-exist"
			response.status.should == 404
		end
	end
end