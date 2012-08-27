class Countries < ActiveRecord::Migration
  def up
  	create_table :countries do |t|
  		t.column :name, :string
  		t.column :code, :string
  	end

  	rename_column :locations, :country, :country_id
  	

  	countries_list = JSON.parse( File.open("#{Rails.root}/tmp/countries_list.js").read )
	Location.reset_column_information
  	countries_list.each do |country_json|
  		country = Country.create({
  			:name => country_json["name"].titleize,
  			:code => country_json["code"]
  			})

  		Location.where({:country_id => country.name}).each do |location|
  			location.country_id = country.id.to_s
  			location.save!
  		end
  	end

    change_column :locations, :country_id, :integer
  end

  def down
  	change_column :locations, :country_id, :string
  	Country.all.each do |country|
  		country.locations.each do |location|
  			country_name = country.name
  			location.country_id = country_name
        location.save!
  		end
  	end

  	rename_column :locations, :country_id, :country
  	drop_table :countries
  end
end
