class JournalEntries < ActiveRecord::Migration
  def up
   create_table :journal_entries do |t|
    t.column :title, :string
    t.column :body, :text
    t.column :location_id, :integer
    t.column :day, :date 
    t.timestamps
   end
  end

  def down
  end
end
