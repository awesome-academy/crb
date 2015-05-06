class SchedulesController < ApplicationController
  before_action :authenticate_user!, except: [:index]
  before_action :correct_user, only: [:edit, :update, :destroy]  

  def index
    @schedules = Schedule.all
    respond_to do |format|
      format.html
      format.json {render json: {schedules: @schedules.as_json}}
    end
  end

  def new
    @schedule = Schedule.new
    @today_schedules = Schedule.today_schedule
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
      render :edit
    end
  end

  def destroy
    Schedule.find(params[:id]).destroy
    flash[:success] = "Schedule deleted"
    redirect_to root_path
  end  

  private
  def schedule_params
    params[:schedule][:start_time] = convert_time params[:schedule][:start_time]
    params[:schedule][:finish_time] = convert_time params[:schedule][:finish_time]

    params.require(:schedule).permit :title, :start_time, :finish_time, :description, :room_id, member_ids: []
  end

  def convert_time str
    DateTime.strptime str, "%m/%d/%Y %H:%M"
  end

  def correct_user
    @schedule = Schedule.find params[:id]
    @user = @schedule.user
    flash[:notice] = "You can't edit this event."
    redirect_to root_url unless (@user == current_user)
  end
end
