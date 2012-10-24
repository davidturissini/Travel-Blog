class LocationCleanup < ActiveRecord::Migration
  def up
  	[:kml_url, :user_id].each do |col|
  		remove_column :locations, col
  	end
  end

  def down
  end
end
