class PhotoUserId < ActiveRecord::Migration
  def up
  	add_column :photos, :user_id, :integer
  end

  def down
  	remove_column :photos, :user_id
  end
end
