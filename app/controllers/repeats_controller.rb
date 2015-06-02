class RepeatsController < ApplicationController
  def check_overlap_time
    repeat_type = params[:repeat]

    if repeat_type.present?
      schedule = Schedule.new schedule_params
      start_time = schedule.start_time
      finish_time = schedule.finish_time
      number_of_schedules = start_time.send("end_of_#{repeat_type}").day - start_time.day + 1
      daylist = overlap_time_days number_of_schedules, schedule.room_id, start_time, finish_time
      render json: {overlap_time_days: daylist}, status: :ok
    else 
      flash[:danger] = "Locked"
      redirect_to root_url
    end
  end

  private
  def schedule_params
    params.require(:schedule).permit :start_time, :finish_time, :room_id
  end

  def overlap_time_days number_of_schedules, room_id, start_time, finish_time
    daylist = []

    number_of_schedules.times do |num|
      schedule_start_time = start_time + num.days
      schedule_finish_time = finish_time + num.days
      overlap_time_count = Schedule.with_room(room_id, nil)
        .filte_timer(schedule_start_time, schedule_finish_time).count
      daylist << schedule_start_time.day if overlap_time_count > 0
    end

    daylist
  end
end
