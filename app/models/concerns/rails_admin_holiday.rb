module RailsAdminHoliday
  extend ActiveSupport::Concern

  included do
    rails_admin do
      list do
        field :id
        field :name
        field :date
        field :is_annual
      end

      edit do
        field :name
        field :date
        field :is_annual
      end
    end
  end
end
