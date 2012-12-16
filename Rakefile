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
end
