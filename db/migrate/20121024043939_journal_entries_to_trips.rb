class JournalEntriesToTrips < ActiveRecord::Migration
  def up
  	remove_column :journals, :location_id
  	remove_column :journals, :day
  	add_column :journals, :start_date, :date
  	add_column :journals, :end_date, :date
  	add_column :journals, :trip_id, :integer
  end

  def down
  	remove_column :journals, :start_date
  	remove_column :journals, :end_date
  	remove_column :journals, :trip_id
  end
end
