puts "Create admin"
FactoryGirl.create :user, email: "admin@crb.com", role: Settings.user_roles.admin

puts "Create 20 users"
20.times {FactoryGirl.create :user}

puts "Create 4 rooms"
Settings.rooms.each{|item| FactoryGirl.create :room, name: item.name, color: item.color}
puts "Create 20 schedules"
20.times {FactoryGirl.create :schedule}
