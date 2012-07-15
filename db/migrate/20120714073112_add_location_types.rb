class AddLocationTypes < ActiveRecord::Migration
  def up
    create_table :locations do |t|
     t.string :title
     t.text :summary
     t.string :flickr_set
     t.string :slug
     t.boolean :has_visited
     t.timestamps
     t.column :latitude, :double
     t.column :longitude, :double
     t.column :city, :string
     t.column :country, :string
     t.column :state, :string
     t.column :kml_url, :string
     t.column :user_id, :integer
    end
  end

  def down
    drop_table :locations
  end
end
