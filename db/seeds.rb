puts "Create admin"
User.create!(name:  "Conference Room Booking System", email: "admin@crb.com", password: 123456, password_confirmation: 123456, role: "admin")

puts "Create 50 user"
50.times do
  User.create!(name: Faker::Name.name, email: Faker::Internet.email, password: 123456, password_confirmation: 123456)
end

puts "Create 5 room"
5.times do
  Room.create!(name: Faker::Name.name)
end