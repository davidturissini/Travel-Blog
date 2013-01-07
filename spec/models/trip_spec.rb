require 'spec_helper'

describe Trip do
	fixtures :users, :trips, :maps, :locations, :posts

	before(:each) do
		@user = create(:user)
		@trip = create(:trip, user:@user, start_date: "01-01-2013", end_date: "08-01-2013")
	end

	describe "#maps" do

		describe "When a trip has maps" do\
			it "should return true" do
				@trip.maps?.should === true
			end
		end

		describe "When a trip has no maps" do
			it "should return false" do

				@trip.stub!(:maps).and_return(Map.where("id > 100000"))
				@trip.maps?.should === false

			end
		end

	end

	describe "#merge!" do
		before(:each) do
			@merge_trip = create(:trip, user:@user, start_date: "25-12-2012", end_date: "10-01-2013")
		end

		it "should move posts from incoming trip to self" do
			
			posts = @merge_trip.posts.all
			@trip.merge!(@merge_trip)

			posts.each do |post|
				post.reload
				post.trip.should === @trip
			end

		end

		it "should keep its own posts" do

			posts = @trip.posts.all
			@trip.merge!(@merge_trip)

			posts.each do |post|
				post.reload
				post.trip.should === @trip
			end

		end

		it "should remove posts from incoming trip" do

			@trip.merge!(@merge_trip)

			@merge_trip.posts.length.should === 0

		end

		it "should move photos from incoming trip to self" do

			photos = @merge_trip.photos.all

			@trip.merge!(@merge_trip)
			
			photos.each do |photo|
				@trip.photos.should include(photo)
			end

		end

		it "should keep its own photos" do

			photos = @trip.photos.all
			@trip.merge!(@merge_trip)
			
			photos.each do |photo|
				@trip.photos.should include(photo)
			end

		end

		it "should remove photos from incoming trip" do

			@trip.merge!(@merge_trip)
			@merge_trip.photos.length.should === 0

		end

		it "should move locations from incoming trip to self" do

			locations = @merge_trip.locations.all

			@trip.merge!(@merge_trip)
			
			locations.each do |location|
				location.reload
				location.trip.should == @trip
			end

		end

		it "should remove locations from incoming trip" do

			@trip.merge!(@merge_trip)
			@merge_trip.locations.length.should === 0

		end

		it "should reload the current trip" do

			@trip.should_receive(:reload)
			@trip.merge!(@merge_trip)

		end

		it "should reload the incoming trip" do

			@merge_trip.should_receive(:reload)
			@trip.merge!(@merge_trip)

		end

		describe "When the incoming trip is deleted" do
			it "should still keep all locations" do

				locations = @merge_trip.locations.all
				@trip.merge!(@merge_trip)
				
				@merge_trip.destroy

				locations.each do |location|
					location.reload
					location.trip.should === @trip
				end

			end
		end

		describe "When the incoming trip has an earlier start_date" do

			it "should update start_date with incoming trip start_date" do

				start_date = @merge_trip.start_date
				@trip.merge!(@merge_trip)

				@trip.start_date.should === start_date

			end

		end

		describe "When the incomint trip has a later end_date" do

			it "should update end_date with incoming trip end_date" do
				end_date = @merge_trip.end_date

				@trip.merge!(@merge_trip)

				@trip.end_date.should === end_date
			end

		end

		describe "When the incoming trip's user isn't the trip's user" do

			before(:each) do
				@merge_user = create(:user)
				@merge_trip = create(:trip, user:@merge_user, start_date: "25-12-2012", end_date: "10-01-2013")
			end

			it "should throw an exceptino" do
				lambda { @trip.merge!(@merge_trip) }.should raise_error
			end

		end

		describe "When the first argument is not a trip" do

			it "should throw an exception" do
				lambda { @trip.merge!("not a trip object") }.should raise_error
			end

		end
	end
end