class MapsPhotosToTrips < ActiveRecord::Migration
  def up
  	create_table :trips_photos, {:id => false} do |t|
  		t.column :trip_id, :integer
  		t.column :photo_id, :integer
  	end

  	add_column :maps, :trip_id, :integer
  	remove_column :maps, :location_id
  end

  def down
  	drop_table :trips_photos
  	remove_column :maps, :trip_id
  	add_column :maps, :location_id, :integer
  end
end
