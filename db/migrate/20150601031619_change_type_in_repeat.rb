class ChangeTypeInRepeat < ActiveRecord::Migration
  def change
    rename_column :repeats, :type, :repeat_type
  end
end
