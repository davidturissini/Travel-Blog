require 'spec_helper'

describe Admin::PostsController do
	fixtures :users, :trips, :maps, :locations, :posts

	describe "routing" do
		it "update post routes to #update" do
	      expect(:put => "/user-slug/posts/post-slug").to route_to({
		      :controller => "admin/posts",
		      :action => "update",
		      :user_id => "user-slug",
		      :id => "post-slug"
		    })
	    end
	end

	describe "GET new" do
		describe "When not trip_id id present" do
			before(:each) do
				@user = users(:user_one)
				controller.stub!(:current_user).and_return(@user)
			end

			it "should create new post for user" do
				get :new, :user_id => @user.slug
				assigns(:post).user.should === @user
			end

			it "should not create new post for trip" do
				get :new, :user_id => @user.slug
				assigns(:post).trip_id.should be_nil
			end
		end

		describe "When a trip_id is present" do
			before(:each) do
				@user = users(:user_one)
				@trip = trips(:trip_one)
				@user.trips.stub!(:find_by_slug).and_return(@trip)
				controller.stub!(:current_user).and_return(@user)
			end

			it "should create new post for trip" do
				get :new, :user_id => @user.slug, :trip_id => @trip.slug
				assigns(:post).trip_id.should === @trip.id
			end
		end
	end

	describe "PUT update" do
		before(:each) do
			@user = users(:user_one)
			@post = posts(:sample_vacation_entry)
			@user.posts.stub!(:find_by_slug).and_return(@post)
			controller.stub!(:current_user).and_return(@user)
		end

		it "should be a success" do
			put :update, :user_id => @user.slug, :id => @post.slug, :post => { :title => "new title" }
			response.should be_success
		end

		it "should render a valid JSON object" do
			put :update, :user_id => @user.slug, :id => @post.slug, :post => { :title => "new title" }
			json = JSON.parse(response.body)
			json.should have_key("title")
		end

		it "should update the post" do
			new_title = "new post title"
			put :update, :user_id => @user.slug, :id => @post.slug, :post => { :title => new_title }
			@post.title.should == new_title
		end

		it "should call Sanitize.clean" do
			body = "ASDASDSA"
			Sanitize.should_receive(:clean).once.and_return(body)
			put :update, :user_id => @user.slug, :id => @post.slug, :post => { :body => body }
		end

		it "should strip whitespace from the body" do
			new_body = "new body"
			put :update, :user_id => @user.slug, :id => @post.slug, :post => { :body => " #{new_body} " }
			@post.body.should == new_body
		end

		describe "when the post body has white listed html tags" do
			it "should update the post" do
				new_body = "new body <a target=\"_blank\" title=\"link title\" href=\"http://www.google.com\">Link to Google</a>"
				put :update, :user_id => @user.slug, :id => @post.slug, :post => { :body => new_body }
				@post.body.should == new_body
			end
		end

		describe "when the post body has black listed html tags" do
			it "should remove those tags" do
				new_body = "new body <a target=\"_blank\" title=\"link title\" href=\"http://www.google.com\">Link to Google</a>"
				bad_tag = "<h1>bad tag</h1>"
				put :update, :user_id => @user.slug, :id => @post.slug, :post => { :body => "#{new_body}#{bad_tag}" }
				@post.body.should == "#{new_body} bad tag"
			end
		end

		describe "when script tags are present" do
			it "should remove the tag and the contents" do
				new_body = "new body <a target=\"_blank\" title=\"link title\" href=\"http://www.google.com\">Link to Google</a>"
				script = "<script>alert(\"asd\");</script>"
				put :update, :user_id => @user.slug, :id => @post.slug, :post => { :body => "#{new_body}#{script}" }
				@post.body.should == new_body
			end
		end
	end
end