class LocationPhotos < ActiveRecord::Migration
  def up
  	create_table :locations_photos, {:id => false} do |t|
  		t.column :location_id, :integer
  		t.column :photo_id, :integer
  	end
  end

  def down
  	drop_table :locations_photos
  end
end
