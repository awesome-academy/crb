puts "Create admin"
FactoryGirl.create :user, email: "admin@crb.com", role: Settings.user_roles.admin

puts "Create 10 users"
10.times {FactoryGirl.create :user}

puts "Create 4 rooms"
Settings.rooms.each{|item| FactoryGirl.create :room, name: item.name, color: item.color}

puts "Creat 5 users, each user have 20 schedule"
users = []
Settings.users.each {|user| users << FactoryGirl.create(:user, name: user.name, email: user.email)}

Room.all.each_with_index do |room, i|
  date_time = DateTime.now + i.days
  start_time_day = date_time.change({hour: Settings.hour_begin_schedule})
  end_time_day = date_time.change({hour: Settings.hour_end_schedule})

  hour, n = start_time_day, 0

  while (hour < end_time_day && n < 10) do
    schedule = FactoryGirl.create :schedule, user: users.sample, start_time: hour

    hour, n = schedule.finish_time, n + 1
  end
end
