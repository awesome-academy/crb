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

end
