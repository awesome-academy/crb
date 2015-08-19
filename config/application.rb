require File.expand_path("../boot", __FILE__)

require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "sprockets/railtie"

Bundler.require(*Rails.groups)

module Crb
  class Application < Rails::Application
    
    config.middleware.delete Rack::Lock
   
    config.time_zone = "Hanoi"
    config.active_record.default_timezone = :local
   
    config.i18n.load_path += Dir[Rails.root.join("config", "locales", "*.{rb,yml}").to_s]
    config.i18n.default_locale = :en

    config.active_record.raise_in_transactional_callbacks = true

    config.action_view.embed_authenticity_token_in_remote_forms = true
    
    config.generators do |g|
      g.test_framework :rspec,
        fixtures: true,
        view_specs: true,
        helper_specs: false,
        routing_specs: false,
        controller_specs: true,
        request_specs: true
      g.fixture_replacement :factory_girl, dir: "spec/factories"
    end
  end
end
