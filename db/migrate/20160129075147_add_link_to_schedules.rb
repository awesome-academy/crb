class AddLinkToSchedules < ActiveRecord::Migration
  def change
    add_column :schedules, :google_link, :string
  end
end
