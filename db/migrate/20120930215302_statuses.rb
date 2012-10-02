class Statuses < ActiveRecord::Migration
  def up
  	create_table :statuses do |t|
  		t.column :location_id, :integer
  		t.column :text, :string
  		t.timestamps
  	end
  end

  def down
  	drop_table :statuses
  end
end
