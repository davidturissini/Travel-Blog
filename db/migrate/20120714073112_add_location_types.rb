class AddLocationTypes < ActiveRecord::Migration
  @@adventure_types = [:vacations, :climbs, :drives]
  def up
   @@adventure_types.each do |adventure_type|
     create_table adventure_type do |t|
       t.string :title
       t.text :summary
       t.string :flickr_set
       t.string :slug
       t.boolean :has_visited
       t.timestamps
      end
     end
     [:climbs, :vacations].each do |type|
       add_column type, :latitude, :double
       add_column type, :longitude, :double
       add_column type, :city, :string
       add_column type, :country, :string
     end
    
     add_column :climbs, :kml_url, :string
     add_column :drives, :kml_url, :string
  end

  def down
   @@adventure_types.each do |type|
     drop_table type
   end
  end
end
