module RailsAdminRepeat
  extend ActiveSupport::Concern

  included do
    rails_admin do
      list do
        field :id
        field :repeat_type
        field :user
      end
    end
  end
end
