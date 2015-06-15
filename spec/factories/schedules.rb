FactoryGirl.define do
  factory :schedule do
    title {Faker::Lorem.sentence}
    description {Faker::Lorem.sentence}
    announced_before {Settings.announced_before.to_h.values.sample}
    finish_time {start_time + 1.hours}
    member_ids {User.ids.sample(2)}
    association :user, factory: :user
    room_id {Room.ids.sample}
  end
end
