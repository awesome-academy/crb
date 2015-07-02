FactoryGirl.define do
  factory :user do
    name {Faker::Company.name}
    email {Faker::Internet.email}
    password 123456
    password_confirmation 123456
    role Settings.user_roles.normal
  end
end
