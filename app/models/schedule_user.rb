class ScheduleUser < ActiveRecord::Base
  belongs_to :member, class_name: "User", foreign_key: :user_id
  belongs_to :event, class_name: "Schedule", foreign_key: :schedule_id
end
