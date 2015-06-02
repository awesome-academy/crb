class RepeatsController < ApplicationController
  def confirm
    repeat_type = params[:repeat]

    if repeat_type.present?
      daylist = []
      schedule = Schedule.new schedule_params
      start_time = schedule.start_time
      finish_time = schedule.finish_time

      if start_time && finish_time
        number_of_schedules = start_time.send("end_of_#{repeat_type}").day - start_time.day + 1
  
        number_of_schedules.times do |num|
          if num > 0
            schedule.start_time = start_time + num.days
            schedule.finish_time = finish_time + num.days
          end

          daylist << schedule.start_time.day if check_overlap_time_of schedule
        end
      end

      render json: {overlap_time_days: daylist}, status: :ok
    else 
      redirect_to root_url
    end
  end

  private
  def schedule_params
    params.require(:schedule).permit :start_time, :finish_time, :room_id
  end

  def check_overlap_time_of schedule
    Schedule.with_room(schedule.room_id, schedule.id).filte_timer(schedule.start_time, schedule.finish_time).count > 0
  end
end