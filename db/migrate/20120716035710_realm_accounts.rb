class RealmAccounts < ActiveRecord::Migration
  def up
   create_table :realm_accounts do |t|
    t.column :provider_id, :string
    t.column :user_id, :integer
    t.column :provider, :string
    t.column :access_token, :string
   end
  end

  def down
   drop_table :realm_accounts
  end
end
