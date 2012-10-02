class TrimmingLocations < ActiveRecord::Migration
  def up
  	[:summary, :flickr_set, :description].each do |field|
  		remove_column :locations, field
  	end
  end

  def down
  	[:summary, :flickr_set, :description].each do |field|
  		add_column :locations, :field, :string
  	end
  end
end
