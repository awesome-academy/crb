class AddGoogleEventIdToSchedule < ActiveRecord::Migration
  def change
    add_column :schedules, :google_event_id, :string
  end
end
