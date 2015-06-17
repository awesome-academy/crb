module RailsAdminSchedule
  extend ActiveSupport::Concern

  included do
    rails_admin do
      list do
        field :id
        field :title
        field :user
        field :start_time
        field :finish_time
        field :created_at
      end
    end
  end
end
