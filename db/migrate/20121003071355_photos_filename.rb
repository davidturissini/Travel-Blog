class PhotosFilename < ActiveRecord::Migration
  def up
  	add_column :photos, :slug, :string
  end

  def down
  	remove_column :photos, :slug
  end
end
