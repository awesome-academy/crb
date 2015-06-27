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

      edit do
        field :title
        field :state, :enum do
          enum do
            Settings.schedule.states
          end
        end
        field :description
        field :start_time
        field :finish_time
        field :user
        field :room
        field :members
        field :announced_before, :enum do
          enum do
            Settings.announced_before.to_h.values
          end
        end
        field :repeat
      end
    end
  end
end
