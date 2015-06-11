FactoryGirl.define do
  factory :schedule do
    title {Faker::Lorem.sentence}
    description {Faker::Lorem.sentence}
    # start_time {Schedule.last.present? ?  (Schedule.last.finish_time + 2.hours) : Time.now
                                                                       # .change({hour: Settings.hour_begin_schedule})}
    finish_time {start_time + 1.hours}
    member_ids {User.ids.sample(2)}
    association :user, factory: :user
    room_id {Room.ids.sample}
  end
end
