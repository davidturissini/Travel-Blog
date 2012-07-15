class LocationTypes < ActiveRecord::Migration
  def up
   create_table :location_types do |t|
    t.column :title, :string
    t.column :location_id, :integer
   end
  end

  def down
   drop_table :location_types
  end
end
