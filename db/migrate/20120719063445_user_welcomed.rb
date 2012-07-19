class UserWelcomed < ActiveRecord::Migration
  def up
   add_column :users, :been_welcomed, :boolean
  end

  def down
   drop_column :users, :been_welcomed
  end
end
