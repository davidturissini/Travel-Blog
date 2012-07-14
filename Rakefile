#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require(File.join(File.dirname(__FILE__), 'config', 'environment'))

require File.expand_path('../config/application', __FILE__)

Adventureblog::Application.load_tasks

namespace :blog do
 task :populate do
   Climb.create({
    :title => "Silver Star Mountain",
    :slug => "silver-star-mountain",
    :summary => "summary for climb",
    :flickr_set => "72157630169317316",
    :has_visited => true,
    :latitude => 48.547945,
    :longitude => -120.585127,
    :city => "Mazama",
    :country => "Washington",
    :kml_url => "https://maps.google.com/maps/ms?authuser=0&vps=2&ie=UTF8&msa=0&output=kml&msid=216638687529279736200.0004c25e3a23e0a597b51"
   })
 end
end
