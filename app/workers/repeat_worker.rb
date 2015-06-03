class RepeatWorker
  include Sidekiq::Worker

  def perform schedule_id, repeat_type
    repeat = Repeat.create repeat_type: repeat_type

    schedule = Schedule.find schedule_id
    schedule.update_attributes repeat_id: repeat.id

    number_of_schedules = schedule.start_time.send("end_of_#{repeat_type}").day -
      schedule.start_time.day
    start_time, finish_time = schedule.start_time, schedule.finish_time

    number_of_schedules.times do |num|
      @new_schedule = Schedule.new schedule.attributes.except("id")
      @new_schedule.start_time = start_time + (num + 1).days
      @new_schedule.finish_time = finish_time + (num + 1).days
  
      @new_schedule.save if @new_schedule.valid?
    end
  end
end
