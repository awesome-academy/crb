class CreateSchedules < ActiveRecord::Migration
  def change
    create_table :schedules do |t|
      t.string :event
      t.text :description
      t.date :date
      t.time :start_time
      t.time :finish_time
      t.string :state
      t.references :user, index: true
      t.references :room, index: true

      t.timestamps null: false
    end
    add_foreign_key :schedules, :users
    add_foreign_key :schedules, :rooms
  end
end
