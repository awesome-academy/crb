class AddAttendeeToSchedule < ActiveRecord::Migration
  def change
    add_column :schedules, :attendee, :text
  end
end
