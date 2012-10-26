class FixMapDescriptionColumn < ActiveRecord::Migration
  def up
  	change_column :maps, :description, :text
  end

  def down
  end
end
