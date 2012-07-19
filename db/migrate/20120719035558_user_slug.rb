class UserSlug < ActiveRecord::Migration
  def up
   add_column :users, :slug, :string
  end

  def down
   drop_column :users, :slug
  end
end
