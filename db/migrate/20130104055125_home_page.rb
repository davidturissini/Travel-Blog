class HomePage < ActiveRecord::Migration
  def up
  	create_table :home_page_stories do |t|
  		t.column :title, :text
  		t.column :text, :text
  		t.column :photo_id, :integer
  		t.column :url, :string
  		t.column :small_photo_url, :string
  	end
  end

  def down
  	drop_table :home_page_stories
  end
end
