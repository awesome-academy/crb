class CreateCreators < ActiveRecord::Migration
  def change
    create_table :creators do |t|
      t.string :email
      t.string :display_name
    end
  end
end
