RailsAdmin.config do |config|
  config.authenticate_with do
    warden.authenticate! scope: :user
  end
  config.current_user_method(&:current_user)

  config.authorize_with :cancan

  config.actions do
    dashboard
    index
    new do
      except [Repeat]
    end
    export
    bulk_delete
    show
    edit do
      except [Repeat]
    end
    delete
  end
end
