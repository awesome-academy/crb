class RepeatsController < ApplicationController
  load_and_authorize_resource only: :destroy

  def confirm
    if schedule_params
      daylist = []
      schedule = Schedule.new schedule_params
      start_time = schedule.start_time
      finish_time = schedule.finish_time

      if start_time && finish_time
        if repeat_type = params[:repeat]
          number_of_schedules = start_time.send("end_of_#{repeat_type}").day - start_time.day + 1

          number_of_schedules.times do |num|
            if num > 0
              schedule.start_time = start_time + num.days
              schedule.finish_time = finish_time + num.days
            end

            daylist << schedule.start_time.day if check_overlap_time_of schedule
          end
        end

        if params[:edit_repeat]
          sample_schedule = Schedule.find params[:schedule_id]
          repeat = Repeat.find sample_schedule.repeat_id
          schedules = repeat.schedules

          schedules.each do |repeated_schedule|
            repeated_day = repeated_schedule.start_time.day
            repeated_schedule.start_time = schedule.start_time.change day: repeated_day
            repeated_schedule.finish_time = schedule.finish_time.change day: repeated_day
            repeated_schedule.room_id = schedule.room_id
            daylist << repeated_day if check_overlap_time_of repeated_schedule
          end
        end
      end

      render json: {overlap_time_days: daylist}, status: :ok
    else
      redirect_to root_url
    end
  end

  def destroy
    @repeat.destroy

    unless params[:_method]
      respond_to do |format|
        format.html {redirect_to user_schedules_path(current_user)}
        format.js
      end
    else
      respond_to do |format|
        format.html {redirect_to root_path}
        format.js
      end
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
