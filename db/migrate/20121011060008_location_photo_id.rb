class LocationPhotoId < ActiveRecord::Migration
  def up
  	add_column :locations, :photo_id, :integer
  	remove_column :locations, :photo_url
  end

  def down
  	add_column :locations, :photo_url, :string
  	remove_column :locations, :photo_id
  end
end
