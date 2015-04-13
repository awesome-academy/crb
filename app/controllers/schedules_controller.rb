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

  def edit
    @schedule = Schedule.find params[:id]
  end

  def update
    @schedule = Schedule.find params[:id]

    if @schedule.update_attributes schedule_params
      flash[:success] = "Event was updated!"
      redirect_to root_path
    else
      flash.now[:danger] = "Update event false!"
      render :edit
    end
  end

  private
  def schedule_params
    params.require(:schedule).permit :event, :date, :start_time, :finish_time,
                                      :description, :room_id
  end
end