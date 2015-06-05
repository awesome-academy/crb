class AddUserIdToRepeats < ActiveRecord::Migration
  def change
    add_column :repeats, :user_id, :integer
  end
end
