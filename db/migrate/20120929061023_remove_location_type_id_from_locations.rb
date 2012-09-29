class RemoveLocationTypeIdFromLocations < ActiveRecord::Migration
  def up
  	remove_column(:locations,:location_type_id)
  end

  def down
  	add_column(:locations,:location_type_id, :integer)
  end
end
