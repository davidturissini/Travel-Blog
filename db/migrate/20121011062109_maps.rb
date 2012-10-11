class Maps < ActiveRecord::Migration
  def up
  	create_table :maps do |t|
  		t.column :location_id, :integer
  		t.column :slug, :string
  		t.timestamps
  	end
  end

  def down
  	drop_table :maps
  end
end
