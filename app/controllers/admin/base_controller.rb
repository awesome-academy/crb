class Admin::BaseController < ActionController::Base
  before_action :authenticate_user!, :authorized_admin!

  private
  def authorized_admin!
    unless current_user.is_admin?
      flash[:alert] = t(:alert_flash)
      redirect_to root_path
    end
  end
end
