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

end