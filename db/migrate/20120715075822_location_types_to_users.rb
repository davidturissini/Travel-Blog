class LocationTypesToUsers < ActiveRecord::Migration
  def up
   add_column :location_types, :user_id, :integer
  end

  def down
   remove_column :locations_types, :user_id
  end
end
