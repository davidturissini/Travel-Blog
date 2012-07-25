class LocationPrimaryPhoto < ActiveRecord::Migration
  def up
   add_column :locations, :photo_url, :string
  end

  def down
   remove_column :locations, :photo_url
  end
end
