require 'spec_helper'

describe Admin::PhotosController do
	fixtures :users, :trips, :maps, :locations, :posts

	describe "routing" do
		it "delete post routes to #destroy" do
	      expect(:delete => "/user-slug/photos/photo-slug").to route_to({
		      :controller => "admin/photos",
		      :action => "destroy",
		      :user_id => "user-slug",
		      :id => "photo-slug"
		    })
	    end

	    it "reprocess routes to #reprocess" do
	    	expect(:get => "/user-slug/photos/photo-slug/reprocess").to route_to({
		      :controller => "admin/photos",
		      :action => "reprocess",
		      :user_id => "user-slug",
		      :photo_id => "photo-slug"
		    })

	    end

	end

	describe "GET reprocess" do
		before(:each) do
			@user = create(:user)
			@photo = Photo.new 
			@photo.slug = "photo-slug"

			controller.stub!(:current_user).and_return(@user)
			@user.stub_chain(:photos, :find_by_slug).and_return(@photo)
			@photo.stub_chain(:reprocess!).and_return(true)
		end

		it "should call reprocess on the photo's static file" do
			@photo.static.should_receive(:reprocess!)
			get :reprocess, :user_id => @user.slug, :photo_id => @photo.slug
		end

	end

	describe "DELETE destroy" do
		before(:each) do
			@user = users(:user_one)
			@photo = Photo.new 
			@photo.slug = "photo-slug"

			controller.stub!(:current_user).and_return(@user)
			@user.stub_chain(:photos, :find_by_slug).and_return(@photo)
		end

		it "should call destory on a photo" do
			@photo.should_receive(:destroy)
			delete :destroy, :user_id => @user.slug, :id => @photo.slug
		end

		it "should respond with JSON of destoryed photo" do
			delete :destroy, :user_id => @user.slug, :id => @photo.slug
			json = JSON.parse( response.body )
			@photo.attributes.should == json
		end
	end
	
end