class AuthRealmsSharedToken < ActiveRecord::Migration
  def up
  	add_column :realm_accounts, :shared_secret, :string
  end

  def down
  	remove_column :realm_accounts, :shared_secret
  end
end
