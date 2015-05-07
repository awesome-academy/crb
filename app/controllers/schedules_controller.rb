class SchedulesController < ApplicationController
  before_action :authenticate_user!, except: [:index]  

  def index
    @today_schedules = Schedule.today_schedule
    @schedule = Schedule.new
    
    if params[:user_id].nil?
      @schedules = Schedule.all
    else
      @user = User.find params[:user_id]
      @schedules = @user.schedules.paginate page: params[:page], per_page: 10
    end

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
    @today_schedules = Schedule.today_schedule
    @schedule = Schedule.new schedule_params
    @schedule.user = current_user

    if @schedule.save
      flash[:success] = "Create new event successfuly!"
      redirect_to root_path
    else
      render :new
    end
  end

  def edit
    @schedule = Schedule.find params[:id]
    authorize! :update, @schedule
  end

  def update
    @schedule = Schedule.find params[:id]
    authorize! :update, @schedule

    if @schedule.update_attributes schedule_params
      flash[:success] = "Event was updated."
      redirect_to root_path
    else
      render :edit
    end
  end

  def destroy
    @schedule = Schedule.find params[:id]
    @schedule.destroy
    unless params[:user_id]
      flash[:success] = "Event was deleted."
      redirect_to root_path
    end
  end  

  private
  def schedule_params
    params[:schedule][:start_time] = convert_time params[:schedule][:start_time]
    params[:schedule][:finish_time] = convert_time params[:schedule][:finish_time]

    params.require(:schedule).permit :title, :start_time, :finish_time, :description, :room_id, member_ids: []
  end

  def convert_time str
    DateTime.strptime(str, "%Y-%m-%d %H:%M").strftime("%Y-%m-%d %H:%M")
  end
end
