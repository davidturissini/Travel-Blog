class TripPhotos < ActiveRecord::Migration
  def up
  	add_column :trips, :photo_id, :integer
  end

  def down
  	remove_column :trips, :photo_id
  end
end
