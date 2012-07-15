class Users < ActiveRecord::Migration
  def up
   create_table :users do |t|
     t.column :name, :string
     t.timestamps
   end
  end

  def down
   drop_table :users
  end
end
