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
  start_time_day = (DateTime.now + i.days).change({hour: Settings.hour_begin_schedule})
  5.times do |n|
    start_time = start_time_day + n.hours
    schedule = FactoryGirl.create :schedule, user: users.sample, start_time: start_time
    start_time_day = schedule.finish_time
  end
end
