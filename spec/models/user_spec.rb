require 'spec_helper'

describe User do
	fixtures :users, :trips, :maps, :locations, :posts

	before(:each) do
		@user = users(:user_one)
	end

	describe "#stories" do
		before(:each) do
			@post = mock_model(Post)
			@trip = mock_model(Trip)
			@post.stub!(:start_date).and_return(Time.now.advance(:year => -1))
			@trip.stub!(:start_date).and_return(Time.now.advance(:month => -1))
			@user.stub_chain(:posts, :where).and_return([@post])
			@user.stub_chain(:trips).and_return([@trip])
		end

		it "should return an array" do
			stories = @user.stories
			stories.should be_kind_of(Array)
		end

		it "should only query posts with no trip_id" do
			@user.posts.should_receive(:where).with("trip_id IS NULL")
			@user.stories
		end

		describe "Post and Trip mixed list" do
			it "should return mixed list of trips and blog posts" do
				stories = @user.stories
				stories.should include(@post)
				stories.should include(@trip)
			end

			it "should return and orderd list of trips and blog posts" do
				post_2 = mock_model(Post)
				post_2.stub!(:start_date).and_return(Time.now)
				@user.stub_chain(:posts, :where).and_return([@post, post_2])
				stories = @user.stories
				stories[0].should == post_2
				stories[1].should == @trip
				stories[2].should == @post
			end
		end
	end
end