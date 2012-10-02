class RemovingLocationTypes < ActiveRecord::Migration
  def up
  	Location.all.each do |location|
      location_type_id = location.location_type_id
      location_type = LocationType.find(location_type_id)
      user = location_type.user
  		location.user_id = user.id
  		location.save!
  	end
  	drop_table :location_types
  end

  def down
  	
  end
end
