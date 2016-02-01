class Room < ActiveRecord::Base
  include RailsAdminRoom

  has_many :schedules, dependent: :destroy

  validates :name, presence: true
  validates :name, uniqueness: true, length: {maximum: 150}

  class << self
    def update_google_room google_rooms, google_service, user
      @room = self.find_by name: "ConferenceRoom"
      google_rooms.each do |google_room|
        if google_room.summary == "ConferenceRoom"
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
      @description = event.description || ""
      @creator = Creator.create_with(display_name: event.creator.displayName).
        find_or_create_by email: event.creator.email
      Schedule.create_with(
        title: event.summary,
        description: @description,
        start_time: event.start.dateTime,
        finish_time: event.end.dateTime,
        user_id: user.id,
        room_id: room.id,
        google_link: event.htmlLink,
        creator: @creator
        ).find_or_create_by google_event_id: event.id
    end

    def update_or_create_google_room google_room
      if @room
        @room.update_attributes google_room_id: google_room.id,
          color: google_room.backgroundColor
      else
        @room = Room.create(
          name: "ConferenceRoom",
          google_room_id: google_room.id,
          color: google_room.backgroundColor)
      end
    end
  end
end
