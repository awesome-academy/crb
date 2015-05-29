class AddRepeatIdToSchedule < ActiveRecord::Migration
  def change
    add_column :schedules, :repeat_id, :integer
  end
end
