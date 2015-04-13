class SchedulesController < ApplicationController
  before_action :authenticate_user!

  def new
    @schedule = Schedule.new
  end

  def create
    @schedule = Schedule.new schedule_params
    @schedule.user = current_user

    if @schedule.save
      flash[:success] = "Create new event successfuly!"
      redirect_to root_path
    else
      flash.now[:danger] = "Create new event false!"
      render :new
    end
  end

  private
  def schedule_params
    params.require(:schedule).permit :event, :date, :start_time, :finish_time,
                                      :description, :room_id, :user_id
  end
end