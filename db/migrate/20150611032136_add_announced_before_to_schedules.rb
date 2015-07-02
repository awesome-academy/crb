class AddAnnouncedBeforeToSchedules < ActiveRecord::Migration
  def change
    add_column :schedules, :announced_before, :integer
  end
end
