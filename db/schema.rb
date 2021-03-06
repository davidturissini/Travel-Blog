# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130104055125) do

  create_table "countries", :force => true do |t|
    t.string "name"
    t.string "code"
  end

  create_table "home_page_stories", :force => true do |t|
    t.text    "title"
    t.text    "text"
    t.integer "photo_id"
    t.string  "url"
    t.string  "small_photo_url"
  end

  create_table "locations", :force => true do |t|
    t.string   "title"
    t.string   "slug"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "latitude"
    t.float    "longitude"
    t.string   "city"
    t.integer  "country_id"
    t.string   "state"
    t.integer  "photo_id"
    t.integer  "trip_id"
    t.date     "start_date"
    t.date     "end_date"
  end

  create_table "locations_photos", :id => false, :force => true do |t|
    t.integer "location_id"
    t.integer "photo_id"
  end

  create_table "maps", :force => true do |t|
    t.string   "slug"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title"
    t.date     "start_date"
    t.date     "end_date"
    t.text     "description"
    t.integer  "trip_id"
    t.float    "start_lat"
    t.float    "start_lng"
    t.string   "map_file_name"
    t.string   "map_content_type"
    t.integer  "map_file_size"
    t.datetime "map_updated_at"
  end

  create_table "photos", :force => true do |t|
    t.string   "title"
    t.string   "description"
    t.integer  "width"
    t.integer  "height"
    t.string   "slug"
    t.integer  "user_id"
    t.string   "static_file_name"
    t.string   "static_content_type"
    t.integer  "static_file_size"
    t.datetime "static_updated_at"
  end

  create_table "posts", :force => true do |t|
    t.string   "title"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.date     "start_date"
    t.date     "end_date"
    t.integer  "trip_id"
    t.string   "slug"
    t.integer  "user_id"
  end

  create_table "realm_accounts", :force => true do |t|
    t.string  "provider_id"
    t.integer "user_id"
    t.string  "provider"
    t.string  "access_token"
    t.string  "shared_secret"
  end

  create_table "statuses", :force => true do |t|
    t.integer  "location_id"
    t.string   "text"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "trips", :force => true do |t|
    t.string   "title"
    t.text     "summary"
    t.string   "slug"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.integer  "photo_id"
    t.date     "start_date"
    t.date     "end_date"
  end

  create_table "trips_photos", :id => false, :force => true do |t|
    t.integer "trip_id"
    t.integer "photo_id"
  end

  create_table "users", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "salt"
    t.string   "token"
    t.string   "slug"
    t.boolean  "been_welcomed"
    t.string   "city"
    t.integer  "country_id"
    t.string   "photo_url"
    t.float    "latitude"
    t.float    "longitude"
    t.text     "description"
  end

end
