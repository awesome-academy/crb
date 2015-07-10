namespace :db do
  desc "remake database data"
  task remake: :environment do
    if Rails.env.development? || Rails.env.staging?
      ["db:drop", "db:create", "db:migrate", "db:seed"].each do |action|
        Rake::Task[action].invoke
      end
    else
      puts 'Can rake db:remake in development & staging environments only'
    end
  end

  task create_admin: :environment do
    puts "Create admin"
    FactoryGirl.create :user, email: "admin@crb.com", role: Settings.user_roles.admin
  end

  task create_rooms: :environment do
    puts "Create 4 rooms"
    Settings.rooms.each{|item| FactoryGirl.create :room, name: item.name, color: item.color}
  end
end
