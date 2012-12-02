class ImportCountriesList < ActiveRecord::Migration
  def up
  	countries_list = JSON.parse( File.open("#{Rails.root}/tmp/countries_list.js").read )
  	countries_list.each do |country_json|
  		country = Country.create({
  			:name => country_json["name"].titleize,
  			:code => country_json["code"]
  			})
  	end
  end

  def down
  end
end
