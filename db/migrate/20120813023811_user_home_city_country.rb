class UserHomeCityCountry < ActiveRecord::Migration
  def up
  	add_column :users, :city, :string
  	add_column :users, :country_id, :integer
  end

  def down
  	remove_column :users, :city
  	remove_column :users, :country_id
  end
end
