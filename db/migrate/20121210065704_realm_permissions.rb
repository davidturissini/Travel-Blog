class RealmPermissions < ActiveRecord::Migration
  def up
  	create_table :realm_permissions do |t|
  		t.column :permission, :string
  		t.column :realm_account_id, :integer
  	end
  end

  def down
  	drop_table :realm_permissions
  end
end
