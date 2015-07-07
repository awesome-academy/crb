FactoryGirl.define do
  factory :room do
    name {Faker::Internet.name}
    color {Faker::Internet.color}
  end
end
