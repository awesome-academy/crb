class SchedulesController < ApplicationController
  load_and_authorize_resource

  def index
    if params[:share_schedules]
      @schedules = Schedule.shared_schedules current_user.id
    elsif params[:search_form]
      @schedules = Schedule.search params[:search_form], current_user.id
    else
      @schedules = Schedule.filter_by_user current_user
    end
  end

  def new
    @today_schedules = Schedule.today_schedule
  end

  def create
    @today_schedules = Schedule.today_schedule
    @schedule.user = current_user

    if @schedule.save
      repeat_type = params[:repeat]
      RepeatWorker.perform_async(@schedule.id, repeat_type, current_user.id) if repeat_type.present?
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
  end

  def edit
  end

  def update
    if @schedule.update_attributes schedule_params
      EditRepeatWorker.perform_async(@schedule.id) if params[:edit_repeat].present?
      flash[:success] = t(:update_flash)
      redirect_to root_path
    else
      render :edit
    end
  end

  def destroy
    @schedule.destroy

    unless params[:user_id]
      respond_to do |format|
        format.html {redirect_to root_path}
        format.js
      end
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

    params.require(:schedule).permit :title, :start_time, :finish_time, :description, :room_id, :announced_before, member_ids: []
  end

  def convert_time str
    DateTime.strptime(str, "%Y-%m-%d %H:%M").strftime("%Y-%m-%d %H:%M")
  end
end
