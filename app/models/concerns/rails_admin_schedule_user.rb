module RailsAdminScheduleUser
  extend ActiveSupport::Concern

  included do
    rails_admin do
      visible false
    end
  end
end
