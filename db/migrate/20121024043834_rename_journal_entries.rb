class RenameJournalEntries < ActiveRecord::Migration
  def up
  	rename_table :journal_entries, :journals
  end

  def down
  	
  end
end
