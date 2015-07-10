ENV["RAILS_ENV"] ||= "test"
require File.expand_path("../../config/environment", __FILE__)

abort("The Rails environment is running in production mode!") if Rails.env.production?

require "spec_helper"
require "rspec/rails"
require "devise"
require "factory_girl_rails"
require "sidekiq"
require "capybara/rspec"
require "rails_admin"

ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  config.include Devise::TestHelpers, type: :controller
  config.include Devise::TestHelpers, type: :view
  config.include FactoryGirl::Syntax::Methods
  config.fixture_path = "#{::Rails.root}/spec/fixtures"
  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
end
