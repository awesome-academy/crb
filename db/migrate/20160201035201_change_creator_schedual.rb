class ChangeCreatorSchedual < ActiveRecord::Migration
  def change
    remove_column :creators, :schedule_id, :integer
    add_column :schedules, :creator_id, :integer
  end
end
