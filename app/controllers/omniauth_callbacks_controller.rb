class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    @user = User.find_for_google_oauth2 request.env["omniauth.auth"], current_user

    @access_token = request.env["omniauth.auth"]["credentials"]["token"]
    session[:access_token] = @access_token
    if session[:access_token]
      google_service = GoogleCalendar.new session[:access_token]
      @calendars = google_service.gather_calendars
      if @calendars.size > 0
        Room.update_google_room @calendars, google_service, current_user
      else
        flash[:error] = t "flash.not_synch"
      end
    end
    redirect_to root_url
  end

  def failure
    super
  end
end
