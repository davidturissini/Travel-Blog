class CreateDatabase < ActiveRecord::Migration
  def up
  	create_table "countries", :force => true do |t|
	    t.string "name"
	    t.string "code"
	  end

	  create_table "journals", :force => true do |t|
	    t.string   "title"
	    t.text     "body"
	    t.datetime "created_at"
	    t.datetime "updated_at"
	    t.date     "start_date"
	    t.date     "end_date"
	    t.integer  "trip_id"
	    t.string   "slug"
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
	  end

	  create_table "photos", :force => true do |t|
	    t.string  "title"
	    t.string  "description"
	    t.integer "width"
	    t.integer "height"
	    t.string  "slug"
	    t.integer "user_id"
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

	  User.create({
	    :name => "anonymous",
	    :slug => "anonymous",
	    :token => "anonymous",
	    :salt => "anonymous"
	    })
  end

  def down
  end
end
