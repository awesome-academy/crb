class SchedulesController < ApplicationController
  before_action :authenticate_user! 

  def index
    @today_schedules = Schedule.today_schedule
    
    if params[:user_id].nil?
      @schedules = Schedule.filter_by_room params[:room_id]
    else
      @user = User.find params[:user_id]
      @schedules = @user.schedules.filter_by_room params[:room_id]
    end

    respond_to do |format|
      format.html
      format.json {render json: {schedules: @schedules.map(&:min_json)}}
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
      repeat_type = params[:repeat]
      RepeatWorker.perform_async(@schedule.id, repeat_type) if repeat_type.present?
      respond_to do |format|
        format.html {redirect_to root_path}
        format.js
      end
    else
      respond_to do |format|
        format.html {render :new}
        format.js
      end      
    end
  end

  def show
    @schedule = Schedule.find params[:id]
  end

  def edit
    @schedule = Schedule.find params[:id]
    authorize! :update, @schedule
  end

  def update
    @schedule = Schedule.find params[:id]
    authorize! :update, @schedule 
    if @schedule.update_attributes schedule_params
      flash[:success] = t(:update_flash)
      redirect_to root_path
    else
      render :edit
    end
  end

  def destroy
    @schedule = Schedule.find params[:id]
    @schedule.destroy
    unless params[:user_id]
      flash[:success] = t(:delete_flash)
      redirect_to root_path
    end
  end  

  private
  def schedule_params
    unless params[:schedule][:start_time].blank?
      params[:schedule][:start_time] = convert_time params[:schedule][:start_time]
    end
    unless params[:schedule][:finish_time].blank?
      params[:schedule][:finish_time] = convert_time params[:schedule][:finish_time]
    end

    params.require(:schedule).permit :title, :start_time, :finish_time, :description, :room_id, member_ids: []
  end

  def convert_time str
    DateTime.strptime(str, "%Y-%m-%d %H:%M").strftime("%Y-%m-%d %H:%M")
  end
end
