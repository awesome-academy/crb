puts "Create admin"
User.create!(name:  "Conference Room Booking System", email: "admin@crb.com", password: 123456, password_confirmation: 123456, role: "admin")

puts "Create 50 user"
50.times do
  User.create!(name: Faker::Name.name, email: Faker::Internet.email, password: 123456, password_confirmation: 123456, role: "normal")
end

puts "Create 5 room"
[["Australia 1",'#D87093'], ["Australia 2", '#20BA22a'], ["Pacific", '#008080'], ["Atlatic", '#456321']].each do |name, color|
  Room.create!(name: name, color: color)
end

puts "Create 20 schedules"
20.times do
  start_time = Schedule.last.present? ? Schedule.last.finish_time : Time.now
  finish_time = start_time + [0.5, 1, 2].sample.hours
  user_random_id = (0..User.count-1).to_a.sample
  room_random_id = (0..Room.count-1).to_a.sample

  schedule = Schedule.new(title: Faker::Lorem.sentence, description: Faker::Lorem.sentence, start_time: start_time, finish_time: finish_time)
  schedule.user = User.all[user_random_id]
  schedule.room = Room.all[room_random_id]
  schedule.save
end
