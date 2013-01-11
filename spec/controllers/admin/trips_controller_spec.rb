require 'spec_helper'

describe Admin::TripsController do
	fixtures :users, :trips, :maps, :locations, :posts

	describe "routing" do
		it "post request to #update" do

	      expect(:put => "/user-slug/trip-slug").to route_to({
		      :controller => "admin/trips",
		      :action => "update",
		      :user_id => "user-slug",
		      :id => "trip-slug"
		    })

	    end

		it "post request to #merge" do

	      expect(:post => "/user-slug/trip-slug/merge?merge_post_id=merge-post-slug").to route_to({
		      :controller => "admin/trips",
		      :action => "merge",
		      :user_id => "user-slug",
		      :trip_id => "trip-slug"
		    })

	    end
	end

	describe "#update" do

		before(:each) do
			@user = create(:user)
			@trip = create(:trip)

			controller.stub!(:current_user).and_return(@user)
			@user.trips.stub!(:find_by_slug).with(@trip.slug).and_return(@trip)
		end

		it "should call #update_attributes" do

			new_title = "new title"
			@trip.should_receive(:update_attributes!)
			put :update, :user_id => @user.slug, :id => @trip.slug, :trip => { :title => new_title }

		end

		describe "Updating title" do
			it "should update the title" do
				trip_id = @trip.id
				new_title = "new title"
				put :update, :user_id => @user.slug, :id => @trip.slug, :trip => { :title => new_title }

				Trip.find(trip_id).title.should == new_title
			end

			it "should call Sanitize.clean" do
				trip_id = @trip.id
				new_title = "new title"

				Sanitize.should_receive(:clean).with(new_title).once

				put :update, :user_id => @user.slug, :id => @trip.slug, :trip => { :title => new_title }

			end
		end

		

		describe "Updating summary" do

			describe "When summary is not nil" do
				it "should update the summary" do
					trip_id = @trip.id
					new_title = "new title"
					new_summary = "new_summary"
					put :update, :user_id => @user.slug, :id => @trip.slug, :trip => { :summary => new_summary, :title => new_title }

					Trip.find(trip_id).summary.should == new_summary
				end

				it "should call Sanitize.clean" do
					trip_id = @trip.id
					new_title = "new title"
					new_summary = "new_summary"

					Sanitize.should_receive(:clean).ordered
					Sanitize.should_receive(:clean).with(new_summary).ordered

					put :update, :user_id => @user.slug, :id => @trip.slug, :trip => { :summary => new_summary, :title => new_title }

				end

				describe "When trailing whitespace is present in summary" do
					it "should call Sanitize.clean without trailing whitespace" do
						trip_id = @trip.id
						new_title = "new title"
						new_summary = "new_summary "

						Sanitize.should_receive(:clean).ordered
						Sanitize.should_receive(:clean).with(new_summary.strip).ordered

						put :update, :user_id => @user.slug, :id => @trip.slug, :trip => { :summary => new_summary, :title => new_title }

					end
				end
			end


			describe "When the summary is nil" do
				it "should not throw an error" do

					trip_id = @trip.id
					new_title = "new title"


					lambda { 
						put :update, :user_id => @user.slug, :id => @trip.slug, :trip => { :summary => nil, :title => new_title }
					}.should_not raise_error

				end
			end

		end

	end

	describe "#merge" do

		before(:each) do
			@user = create(:user)

			@trip = create(:trip, :user => @user)
			@merge_trip = create(:trip, :user => @user)

			controller.stub!(:current_user).and_return(@user)

			@user.trips.stub!(:find_by_slug).with(@trip.slug).and_return(@trip)
			@user.trips.stub!(:find_by_slug).with(@merge_trip.slug).and_return(@merge_trip)

		end

		it "should call merge on the incoming trip" do

			@trip.should_receive(:merge!).with(@merge_trip)
			post :merge, :user_id => @user.slug, :trip_id => @trip.slug, :merge_trip_id => @merge_trip.slug, :format => "json"

		end

		it "should destroy the merged trip" do

			trip_id = @merge_trip.id
			post :merge, :user_id => @user.slug, :trip_id => @trip.slug, :merge_trip_id => @merge_trip.slug, :format => "json"

			lambda { Trip.find(trip_id) }.should raise_error ActiveRecord::RecordNotFound
		end

		it "should redirect to the trip show page" do
			post :merge, :user_id => @user.slug, :trip_id => @trip.slug, :merge_trip_id => @merge_trip.slug
			response.code.should == "302"
			response.should redirect_to("/#{@user.slug}/#{@trip.slug}")
		end

	end
end