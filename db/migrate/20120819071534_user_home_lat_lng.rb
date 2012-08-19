class UserHomeLatLng < ActiveRecord::Migration
  def up
  	add_column :users, :latitude, :double
  	add_column :users, :longitude, :double
  end

  def down
  	remove_column :users, :latitude
  	remove_column :users, :longitude
  end
end
