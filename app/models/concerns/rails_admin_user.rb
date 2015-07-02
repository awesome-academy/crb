module RailsAdminUser
  extend ActiveSupport::Concern

  included do
    rails_admin do
      list do
        field :id
        field :name
        field :role
        field :email
        field :avatar
        field :created_at
      end

      edit do
        field :name
        field :email
        field :role, :enum do
          enum do
            Settings.user_roles.to_h.values
          end
        end
        field :avatar
      end
    end
  end
end
