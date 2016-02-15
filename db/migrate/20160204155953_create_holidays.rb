class CreateHolidays < ActiveRecord::Migration
  def change
    create_table :holidays do |t|
      t.string :name
      t.date :date
      t.boolean :is_annual, default: true
    end
  end
end
