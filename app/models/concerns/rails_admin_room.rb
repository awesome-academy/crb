module RailsAdminRoom
  extend ActiveSupport::Concern

  included do
    rails_admin do
      list do
        field :id
        field :name
        field :color
        field :created_at
      end

      edit do
        field :name
        field :color
      end
    end
  end
end
