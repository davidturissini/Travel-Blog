class RemovingLocationTypes < ActiveRecord::Migration
  def up
  	Location.all.each do |location|
  		user = location.user
  		location.user_id = user.id
  		location.save!
  	end
  	drop_table :location_types
  end

  def down
  	
  end
end
