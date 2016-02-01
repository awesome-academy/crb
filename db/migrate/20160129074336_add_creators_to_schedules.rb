class AddCreatorsToSchedules < ActiveRecord::Migration
  def change
    add_column :creators, :schedule_id, :integer
  end
end
