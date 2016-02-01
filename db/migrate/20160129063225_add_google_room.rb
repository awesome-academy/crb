class AddGoogleRoom < ActiveRecord::Migration
  def change
    add_column :rooms, :google_room_id, :string
  end
end
