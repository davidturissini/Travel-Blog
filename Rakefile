#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require(File.join(File.dirname(__FILE__), 'config', 'environment'))

require File.expand_path('../config/application', __FILE__)

Adventureblog::Application.load_tasks

namespace :traveladdict do
	task :migrate_posts do
		Post.all.each do |post|
			trip_id = post.trip_id
			trip = Trip.find(trip_id)
			user = trip.user
			post.user = user
			post.save!
		end
	end

	task :build_home_page do
		ActiveRecord::Base.transaction do
			HomePageStory.delete_all
			user = User.dave

			new_york = user.trips.find_by_slug("new-york")
			wilder = user.trips.find_by_slug("wilder-ranch-state-park")
			daniel = user.trips.find_by_slug("mt-daniel")
			road_trip = user.trips.find_by_slug("us-101-roadtrip")
			new_orleans = user.trips.find_by_slug("new-orleans")

			HomePageStory.create_from_trip(new_york, {
				:text => "Christmas in New York. From avoiding crowds to getting lost in Soho, see how we enjoyed the city."
				})

			HomePageStory.create_from_trip(wilder, {
				:text => "Explore the beautiful Califoria coast with this hike in Santa Cruz"
				})

			HomePageStory.create_from_trip(daniel, {
				:text => "Rain in Washington? Not in July. What better way to spend a Saturday than climbing 7,960 ft Mt. Daniel."
				})

			HomePageStory.create_from_trip(road_trip, {
				:text => "There are fewer trips more beautiful than US 101 between Newport, Oregon and San Francisco."
				})
			
			HomePageStory.create_from_trip(new_orleans, {
				:text => "Forget Bourbon Street, a trip to the Big Easy isn't complete without festivals and alligator tours."
				})
		end
	end
end
