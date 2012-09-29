class LocationRemoveHasVisited < ActiveRecord::Migration
  def up
  	remove_column :locations, :has_visited
  end

  def down
  	add_column :locations, :has_visited, :boolean
  end
end
