class UserSalt < ActiveRecord::Migration
  def up
   add_column :users, :salt, :string
   add_column :users, :token, :string
  end

  def down
   drop_column :users, :salt
   drop_column :users, :token
  end
end
