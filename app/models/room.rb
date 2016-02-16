class Room < ActiveRecord::Base
  include RailsAdminRoom

  has_many :schedules, dependent: :destroy

  validates :name, presence: true
  validates :name, uniqueness: true, length: {maximum: 150}

  class << self
    def update_google_room google_rooms, google_service, user
      @room = self.find_by name: Settings.conference_room
      google_rooms.each do |google_room|
        if google_room.summary == Settings.conference_room
          update_or_create_google_room google_room
        end
      end
      if @room
        @event_google = google_service.gather_calendar_events @room.google_room_id
        if @event_google.size > 0
          @event_google.each do |event|
            create_schedule_google event, @room, user
          end
        end
      end
    end

    def create_schedule_google event, room, user
      unless event.start.date_time.nil?
        update_or_create_schedule_google event, room, user
      end
    end

    def update_or_create_google_room google_room
      if @room
        @room.update_attributes google_room_id: google_room.id,
          color: google_room.backgroundColor
      else
        @room = Room.create(
          name: Settings.conference_room,
          google_room_id: google_room.id,
          color: google_room.backgroundColor)
      end
    end

    def update_or_create_schedule_google google_event, room, user
      @description = google_event.description || ""
      @creator = Creator.create_with(display_name: google_event.creator.displayName).
        find_or_create_by email: google_event.creator.email
      @event = Schedule.find_by google_event_id: google_event.id
      if @event
        update_google_event @event, google_event, @description
      else
        create_google_event google_event, @description, room,user, @creator
      end
    end

    def update_google_event event, google_event, description
      event.update_attributes(
        title: google_event.summary,
        description: description,
        start_time: google_event.start.date_time,
        finish_time: google_event.end.date_time,
        attendee: google_event.attendees)
    end

    def create_google_event event, description, room, user, creator
      Schedule.create(
        title: event.summary,
        description: description,
        start_time: event.start.date_time,
        finish_time: event.end.date_time,
        user_id: user.id,
        room_id: room.id,
        google_link: event.htmlLink,
        creator: creator,
        google_event_id: event.id,
        attendee: event.attendees)
    end
  end
end
