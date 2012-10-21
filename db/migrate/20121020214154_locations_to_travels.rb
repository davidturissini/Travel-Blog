class LocationsToTravels < ActiveRecord::Migration
  def up
  	create_table :trips do |t|
     t.string :title
     t.text :summary
     t.string :slug
     t.timestamps
     t.column :user_id, :integer
    end

    add_column :locations, :trip_id, :integer

    Location.all.each do |location|
    	trip = Trip.create({
    		:user => location.user,
    		:title => location.title
    		})
    	location.trip_id = trip.id
    	location.save!
    end
  end

  def down
  	remove_column :locations, :trip_id
  	drop_table :trips
  end
end
