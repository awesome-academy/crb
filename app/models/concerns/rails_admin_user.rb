module RailsAdminUser
  extend ActiveSupport::Concern

  included do
    rails_admin do
      list do
        field :id
        field :name
        field :email
        field :avatar
        field :created_at
      end

      edit do
        field :id
        field :name
        field :email
        field :role
        field :avatar
      end
    end
  end
end
