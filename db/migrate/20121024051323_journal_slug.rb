class JournalSlug < ActiveRecord::Migration
  def up
  	add_column :journals, :slug, :string
  end

  def down
  	remove_column :journals, :slug
  end
end
