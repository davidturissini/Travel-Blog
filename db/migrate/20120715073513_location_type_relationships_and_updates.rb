class LocationTypeRelationshipsAndUpdates < ActiveRecord::Migration
  def up
   add_column :locations, :location_type_id, :integer
   add_column :location_types, :slug, :string
  end

  def down
    remove_column :locations, :location_type_id
    remove_column :location_types, :slug
  end
end
