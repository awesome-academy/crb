class GoogleCalendar
  def initialize token
    @token = token
  end

  def gather_calendar_events calendar_id = ""
    response = client.execute(
      api_method: cal_api.events.list,
      parameters: {
        calendarId: calendar_id,
        singleEvents: true,
        timeMin: Date.today.to_datetime.utc.iso8601,
        timeMax: 1.months.from_now.to_datetime.utc.iso8601,
        maxResults: 2500
      }
    )
    if response.status == 200
      response.data["items"]
    else
      Array.new
    end
  end

  def gather_calendars
    response = client.execute api_method: cal_api.calendar_list.list
    if response.status == 200
      response.data["items"]
    else
      Array.new
    end
  end

  def client
    return @client if @client
    @client = Google::APIClient.new
    @client.authorization = Signet::OAuth2::Client.new(
      client_id: Rails.application.secrets.client_id,
      client_secret: Rails.application.secrets.client_secret,
      access_token: @token
    )
    @client
  end

  def cal_api
    return @cal_api if @cal_api
    @cal_api = client.discovered_api Settings.calendar, Settings.version
  end
end
