class CreateEmails < ActiveRecord::Migration[8.0]
  def change
    create_table :emails do |t|
      t.string :object
      t.text :body
      t.boolean :is_read, default: false
      t.timestamps
    end
  end
end
