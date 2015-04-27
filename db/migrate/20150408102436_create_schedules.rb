class CreateSchedules < ActiveRecord::Migration
  def change
    create_table :schedules do |t|
      t.string :title
      t.text :description
      t.datetime :start_time
      t.datetime :finish_time
      t.string :state, default: "pending"
      t.references :user, index: true
      t.references :room, index: true

      t.timestamps null: false
    end
    add_foreign_key :schedules, :users
    add_foreign_key :schedules, :rooms
  end
end
