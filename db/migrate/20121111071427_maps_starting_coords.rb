class MapsStartingCoords < ActiveRecord::Migration
  def up
  	add_column :maps, :start_lat, :double
  	add_column :maps, :start_lng, :double
  end

  def down
  	remove_column :maps, :start_lat
  	remove_column :maps, :start_lng
  end
end
