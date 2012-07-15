#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require(File.join(File.dirname(__FILE__), 'config', 'environment'))

require File.expand_path('../config/application', __FILE__)

Adventureblog::Application.load_tasks

namespace :travel do
 task :stub do
   user = User.create({
     :name => "David"
   })

   ["Climb", "Drive", "Vacation"].each do |loc|
     LocationType.create({
       :slug => loc.downcase.pluralize,
       :title => loc,
       :user => user
     })
   end
   Location.create({
     :title => "Silver Star Mountain",
     :location_type => LocationType.where({ :title => "Climb" }).first,
     :flickr_set => "72157630169317316",
     :latitude => 48.547945,
     :longitude => -120.585127,
     :has_visited => true,
     :city => "Mazama",
     :country => "Washington",
     :slug => "silver-star-mountain",
     :kml_url => "https://maps.google.com/maps/ms?authuser=0&vps=2&ie=UTF8&msa=0&output=kml&msid=216638687529279736200.0004c25e3a23e0a597b51"
   })
   Location.create({
     :title => "US 101",
     :location_type => LocationType.where({ :title => "Drive" }).first,
     :slug => "us-101",
     :kml_url => "https://maps.google.com/maps/ms?authuser=0&vps=2&hl=en&ie=UTF8&msa=0&output=kml&msid=216638687529279736200.0004c2b68bcbae2fdf523"
   })
 
   Location.create({
     :title => "Ben Coda, Ad Brown and our neighbors to the North",
     :slug => "test-ui",
     :location_type => LocationType.where({ :title => "Vacation" }).first,
     :flickr_set => "72157630027148785"
   })
 end
end
