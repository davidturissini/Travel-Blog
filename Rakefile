#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require(File.join(File.dirname(__FILE__), 'config', 'environment'))

require File.expand_path('../config/application', __FILE__)

Adventureblog::Application.load_tasks

namespace :travel do
 task :seed_users do
  User.create({
    :name => "anonymous",
    :slug => "anonymous",
    :token => "anonymous"
    })
 end
 task :wp_import do
  user = User.find_by_name("David Turissini")
  location_type = user.location_types.find_by_slug("vacations")
  vacations = []
  vacations_file = File.open("#{Rails.root}/tmp/vacations.xml")
  vacations_xml = Nokogiri::XML(vacations_file)
  wp_ns = "http://wordpress.org/export/1.2/"
  content_ns = "http://purl.org/rss/1.0/modules/content/"
  item_nodes = vacations_xml.xpath("//item").each do |item|
   id = item.xpath("wp:post_id", "wp" => wp_ns).first.text.to_i
   vacation = {
    :title => item.xpath("title").text,
    :slug => item.xpath("wp:post_name", "wp" => wp_ns).text,
    :location_type => location_type,
    :created_at => item.xpath("wp:post_date", "wp" => wp_ns).text,
    :summary => item.xpath("content:encoded", "content" => content_ns).first.content
   }
   item.xpath("wp:postmeta", "wp" => wp_ns).each do |meta_tag|
    meta_key = meta_tag.xpath("wp:meta_key", "wp" => wp_ns).text
    meta_value = meta_tag.xpath("wp:meta_value", "wp" => wp_ns).text
    if meta_key == "lng"
     vacation[:longitude] = meta_value
    elsif meta_key == "lat"
     vacation[:latitude] = meta_value 
    elsif meta_key != "_edit_last"
     vacation[meta_key] = meta_value 
    end
   end
   
   location = Location.new(vacation)
   location.id = id.to_i
   location.save!
  end
 
  journal_entries_file = File.open("#{Rails.root}/tmp/journal-entries.xml")
  entries_xml = Nokogiri::XML(journal_entries_file)
  item_nodes = entries_xml.xpath("//item").each do |entry_node|
    content_ns = "http://purl.org/rss/1.0/modules/content/"
    entry = {
     :title => entry_node.xpath("title").text,
     :body => entry_node.xpath("content:encoded", "content" => content_ns).first.content,
     :created_at => entry_node.xpath("wp:post_date", "wp" => wp_ns).text,
    }
    entry_node.xpath("wp:postmeta", "wp" => wp_ns).each do |meta_tag|
     meta_key = meta_tag.xpath("wp:meta_key", "wp" => wp_ns).text
     meta_value = meta_tag.xpath("wp:meta_value", "wp" => wp_ns).text
     if meta_key == "location_id"
      if(meta_value.to_i == 28 ) 
       puts meta_tag.inspect + " IIII"
      end
      entry[:location] = Location.find(meta_value.to_i)
     elsif meta_key != "_day" && meta_key != "_location_id" && meta_key != "_edit_last"
      entry[meta_key] = meta_value
     end
    end
    if entry[:location]
     JournalEntry.create(entry)
    else
     puts "No Location found for entry #{entry[:title]}"
    end
  end
 end
end
