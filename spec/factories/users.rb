FactoryGirl.define do
  factory :user do
    sequence(:name) {|n| "example#{n}"} 
    sequence(:email) {|n| "example#{n}@gmail.com"}
    password 123456
    password_confirmation 123456
    role Settings.user_roles.normal

    factory :user_with_avatar do
      avatar { File.new("#{Rails.root}/spec/factories/avatar.png") }
    end
  end
end
