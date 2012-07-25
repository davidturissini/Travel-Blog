class LocationTypeMapIconUrl < ActiveRecord::Migration
  def up
   add_column :location_types, :icon_url, :string
   add_column :location_types, :icon_not_visited_url, :string
  end

  def down
   remove_column :location_types, :icon_url
   remove_column :location_types, :icon_not_visited_url
  end
end
