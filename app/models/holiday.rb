class Holiday < ActiveRecord::Base
  include RailsAdminHoliday

  QUERY = "(is_annual = 0 AND date BETWEEN :from AND :to)
    OR (is_annual = 1 AND DATE_FORMAT(date,'%m-%d') >= DATE_FORMAT(:from,'%m-%d')
    AND DATE_FORMAT(date,'%m-%d') <= DATE_FORMAT(:to,'%m-%d'))"

  validates :name, presence: true
  validates :date, presence: true

  scope :in_range, -> (from, to){where(QUERY, from: from, to: to)}
end
