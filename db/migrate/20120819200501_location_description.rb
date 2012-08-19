class LocationDescription < ActiveRecord::Migration
  def up
  	add_column :locations, :description, :string
  end

  def down
  	remove_column :locations, :description
  end
end
