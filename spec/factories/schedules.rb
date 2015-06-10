FactoryGirl.define do
  factory :schedule do
    title {Faker::Lorem.sentence}
    description {Faker::Lorem.sentence}
    start_time {Schedule.last.present? ? Schedule.last.finish_time : Time.now
                                                                       .change({hour: Settings.hour_start_time})}
    finish_time {start_time + [2, 3].sample.hours}
    association :user, factory: :user
    room_id Room.ids.sample
    member_ids {User.ids.sample(2)}
  end
end
