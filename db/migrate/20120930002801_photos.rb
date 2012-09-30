class Photos < ActiveRecord::Migration
  def up
  	create_table :photos do |t|
  		t.column :title, :string
  		t.column :description, :string
  		t.column :width, :integer
  		t.column :height, :integer
  	end
  end

  def down
  	drop_table :photos
  end
end
