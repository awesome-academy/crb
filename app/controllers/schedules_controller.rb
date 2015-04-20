class SchedulesController < ApplicationController
  before_action :authenticate_user!, except: [:index]
  before_action :get_schedule_to_day, only: [:new, :edit]

  def index
    @schedules = Schedule.all
    respond_to do |format|
      format.html
      format.json {render json: {schedules: @schedules.as_json}}
    end
  end

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
    params.require(:schedule).permit :title, :start_time, :finish_time,
      :description, :room_id
                                    
  end

  def get_schedule_to_day
    @feed_items = Schedule.today_schedule
  end
end
