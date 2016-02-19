class SchedulesController < ApplicationController
  load_and_authorize_resource
  before_action :load_rooms, only: [:new, :edit]

  def index
    if params[:share_schedules]
      @schedules = Schedule.shared_schedules current_user.id
    elsif params[:search_form]
      @schedules = Schedule.search params[:search_form], current_user.id
    else
      @schedules = Schedule.filter_by_user current_user
    end
  end

  def show
  end

  def new
    @users = User.without_user(current_user.id).pluck :name, :id
    decode_and_assign_value if params[:data]
  end

  def create
    @users = User.without_user(current_user.id).pluck :name, :id
    @schedule.user = current_user

    if @schedule.save
      repeat_type = params[:repeat]

      if repeat_type.present?
        RepeatWorker.perform_async @schedule.id, repeat_type
      else
        added_member_ids = @schedule.member_ids
        MembersInvitationWorker.perform_async added_member_ids, [@schedule.id]
      end

      respond_to do |format|
        if GoogleCalendar.sync_to_google_calendar @schedule
          format.html {redirect_to root_path}
          format.js
        else
          format.js {flash[:error] = t("schedules.synchronize.message.require_login_google")}
        end
      end
    else
      respond_to do |format|
        format.html {render :new}
        format.js
      end
    end
  end

  def edit
    @users = User.without_user(current_user.id).pluck :name, :id
  end

  def update
    old_member_ids = @schedule.member_ids
    @users = User.without_user(current_user.id).pluck :name, :id

    if @schedule.update_attributes schedule_params
      new_member_ids = @schedule.member_ids
      added_member_ids = new_member_ids - old_member_ids
      removed_member_ids = old_member_ids - new_member_ids
      schedule_id = @schedule.id
      announce = @schedule.have_important_changes

      if params[:edit_repeat].present?
        EditRepeatWorker.perform_async schedule_id, announce, added_member_ids, removed_member_ids
      else
        shared_member_ids = new_member_ids & old_member_ids
        UpdatedEventsAnnouncementWorker.perform_async(shared_member_ids, [schedule_id]) if announce
        MembersInvitationWorker.perform_async added_member_ids, [schedule_id]
        RemovedMembersAnnouncementWorker.perform_async removed_member_ids, [schedule_id]
      end

      flash[:success] = t("flash.update")
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
    params.require(:schedule).permit :title, :start_time, :finish_time, :description, :room_id, :announced_before, member_ids: []
  end

  def decode_and_assign_value
    data = Base64.decode64 params[:data]
    data = JSON.parse data
    @schedule.start_time = format_datetime data["start_time"]
    @schedule.finish_time = format_datetime data["finish_time"]
    @schedule.title = data["title"]
  end

  def format_datetime datetime
    datetime.to_datetime().strftime "%Y-%m-%d %H:%M"
  end

  def load_rooms
    @rooms = Room.select :id, :name
  end
end
