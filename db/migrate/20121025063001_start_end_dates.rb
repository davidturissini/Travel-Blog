class StartEndDates < ActiveRecord::Migration
  def up
  	tables.each do |table_name|
	  	add_column table_name, :start_date, :date
	  	add_column table_name, :end_date, :date
	end
  end

  def down
  	tables.each do |table_name|
  		remove_column table_name, :start_date
	  	remove_column table_name, :end_date
	end
  end

  def tables
  	[:trips, :locations]
  end
end
