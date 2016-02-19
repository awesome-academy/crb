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
    if response.status == 200 || response.status == 204
      response.data["items"]
    else
      Array.new
    end
  end

  class << self
    def sync_to_google_calendar schedule
      attendees = []
      schedule.members.each{|member| attendees << {email: member.email}}
      event = {
        summary: schedule.title,
        description: schedule.description,
        start: {dateTime: schedule.start_time.to_datetime.rfc3339},
        end: {dateTime: schedule.finish_time.to_datetime.rfc3339},
        attendees: attendees
      }
      if schedule.user.token.present?
        refresh_token_if_expired schedule.user
        client = init_client schedule
        service = client.discovered_api Settings.calendar, Settings.version
        response = client.execute(
          api_method: service.events.insert,
          parameters: {calendarId: Settings.conference_room_calendar_id, sendNotifications: true},
          body: JSON.dump(event),
          headers: {"Content-Type" => "application/json"})
        return update_schedule_info schedule, response
      end
      false
    end

    def delete_to_google_calendar schedule
      if schedule.user.token.present?
        if schedule.google_event_id.present?
          refresh_token_if_expired schedule.user
          client = init_client schedule
          service = client.discovered_api Settings.calendar, Settings.version
          response = client.execute(api_method: service.events.delete,
            parameters: {calendarId: Settings.conference_room_calendar_id,
            eventId: schedule.google_event_id})
          return true if response.status == 200 || response.status == 204
        end
      end
      false
    end

    def update_schedule_info schedule, response
      if response.status == 200
        creator = Creator.create_with(display_name: response.data["creator"]["displayName"]).
          find_or_create_by email: response.data["creator"]["email"]
        schedule.update_attributes(google_link: response.data["htmlLink"],
          google_event_id: response.data["id"], creator: creator)
        return true
      end
      false
    end

    def refresh_token_if_expired user
      if user_token_expired? user
        response = RestClient.post(Settings.refresh_token_url,
          grant_type: "refresh_token", refresh_token: user.refresh_token,
          client_id: ENV["GOOGLE_CALENDAR_KEY"], client_secret: ENV["GOOGLE_CALENDAR_SECRET"])
        refresh_hash = JSON.parse response.body

        user.token = refresh_hash["access_token"]
        user.expires_at = DateTime.now.to_i.seconds + refresh_hash["expires_in"].to_i.seconds
        user.save
      end
    end

    def user_token_expired? user
      expiry = Time.at(user.expires_at.to_i) if user.expires_at
      return true if expiry.nil? || expiry < Time.now
      false
    end

    def init_client schedule
      client = Google::APIClient.new
      client.authorization = Signet::OAuth2::Client.new(
        client_id: Rails.application.secrets.client_id,
        client_secret: Rails.application.secrets.client_secret,
        access_token: schedule.user.token
      )
      client
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
