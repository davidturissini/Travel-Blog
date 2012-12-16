class TripsJournals < ActiveRecord::Migration
  def up
  	rename_table :journals, :posts
    add_column :posts, :user_id, :integer
  end

  def down
  	remove_column :posts, :user_id
  	rename_table :posts, :journals
  end
end
