class MapsMetadata < ActiveRecord::Migration
  def up
  	add_column :maps, :title, :string
  	add_column :maps, :start_date, :date
  	add_column :maps, :end_date, :date
  	add_column :maps, :description, :date
  end

  def down
  	remove_column :maps, :title
  	remove_column :maps, :start_date
  	remove_column :maps, :end_date
  	remove_column :maps, :description
  end
end
